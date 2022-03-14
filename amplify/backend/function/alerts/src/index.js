const {
  batchReadItem,
  getTableNameFromInitialWord,
  filterTableByList,
} = require("/opt/nodejs/databaseUtils");
const { divideArrayBySize, utility } = require("/opt/nodejs/utility");
const { instrumentValuation, holdingValuation, calculateDiffPercent, convertTroyOunceToGram } = require("/opt/nodejs/alertsVal");
const { sendMessage } = require("/opt/nodejs/sqsUtils");
const { getCommodityPrice, getCryptoPrice, getFXRate } = require("../../moneopricelayer/lib/nodejs/eod");

const getInstrumentsData = async (ids, table, infoMap) => {
  let results = [];
  const splittedArray = divideArrayBySize([...ids], 100);
  const tableName = await getTableNameFromInitialWord(table);
  for (arrays of splittedArray) {
    let keys = [];
    arrays.map((id) => keys.push({ id: id }));
    const data = await batchReadItem(tableName, keys);
    results = [...results, ...data];
  }
  results.forEach((item) => {
    infoMap[item.id] = item;
    ids.delete(item.id);
  });
};

const processData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersinsMap = {};
      const usersholdingMap = {};
      const infoMap = {};

      const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
      const userinfodata = await filterTableByList(
        userInfoTableName,
        [
          "investments.doctor@gmail.com",
          "emailumangdoctor@gmail.com",
          "mehzabeen1526@gmail.com",
          "ravinder.singh.rawat2008@gmail.com",
        ],
        "email",
        "uname, email"
      );
      // const userinfodata = await getTabledata(
      //   userInfoTableName,
      //   "uname, email",
      //   `notify = :notify`,
      //   { ":notify": true }

      const usersMap = {};
      userinfodata.map((item) => (usersMap[item.uname] = item.email));

      // UserIns data
      let mfIds = new Set();
      let otherIds = new Set();
      const userinsTableName = await getTableNameFromInitialWord("UserIns");
      const userinsdata = await filterTableByList(
        userinsTableName,
        Object.keys(usersMap),
        "uname",
        "uname, ins"
      );
      for (let item of userinsdata) {
        usersinsMap[item.uname] = item.ins;
        for (let ins of item.ins) {
          if (ins.id.startsWith("INF")) mfIds.add(ins.id);
          else otherIds.add(ins.id);
        }
      }

      // Mutual Fund data
      if (mfIds.size) {
        await getInstrumentsData(mfIds, "INMFPrice", infoMap);
      }
      mfIds.forEach((id) => otherIds.add(id));

      // Exchg data
      if (otherIds.size) {
        await getInstrumentsData(otherIds, "INExchgPrice", infoMap);
      }

      // Bond data
      if (otherIds.size) {
        await getInstrumentsData(otherIds, "INBondPrice", infoMap);
      }

      // holdings
      const userholdingsTableName = await getTableNameFromInitialWord(
        "UserHoldings"
      );
      const userholdingsdata = await filterTableByList(
        userholdingsTableName,
        Object.keys(usersMap),
        "uname",
        "uname, crypto, nps, pm"
      );
      let npsIds = new Set();
      let pmIds = new Set();
      let cryptoIds = new Set();
      for (let item of userholdingsdata) {
        usersholdingMap[item.uname] = [ ...item.nps, ...item.pm, ...item.crypto ];
        for (let holding of item.nps) {
          npsIds.add(holding.name);
        }
        for (let holding of item.pm) {
          pmIds.add(holding.subt === "Gold" ? "GC" : holding.subt);
        }
        for (let holding of item.crypto) {
          cryptoIds.add(holding.name);
        }
      }

      // Nps data
      if (npsIds.size) {
        await getInstrumentsData(npsIds, "NPSPrice", infoMap);
      }

      const { date, month, yearFull } = utility(1);
      const fromDate = `${yearFull}-${month}-${date}`

      const fxRate = await getFXRate("INR");
      const convertUSDToINR = (amt) => fxRate * convertTroyOunceToGram(amt);

      // Commodity
      const pmArray = [...pmIds];
      if (pmIds.size) {
        for (let ids of pmArray) {
          const data = await getCommodityPrice(ids, fromDate);
          infoMap[ids] = { prev: convertUSDToINR(data[0]), price: convertUSDToINR(data[1]) };
        }
      }

      // Crytpo
      const cryptoArray = [...cryptoIds];
      if (cryptoIds.size) {
        for (let ids of cryptoArray) {
          const data = await getCryptoPrice(ids, fromDate);
          infoMap[ids] = { prev: convertUSDToINR(data[0]), price: convertUSDToINR(data[1]) };
        }
      }

      let sendUserInfo = {};
      Object.keys(usersMap).map((user) => {
        let prev = 0;
        let price = 0;
        const email = usersMap[user];
        let { gainers, losers, yhighList, ylowList, totalPrev, totalPrice } =
          instrumentValuation(infoMap, usersinsMap[user]);
        prev += totalPrev;
        price += totalPrice;

        let { totalHoldingsPrev, totalHoldingsPrice } = holdingValuation(infoMap, usersholdingMap[user], pmArray);
        prev += totalHoldingsPrev;
        price += totalHoldingsPrice;
        const chgAmount = price - prev;
        const chg = Math.round(calculateDiffPercent(price, prev) * 100) / 100;
        const chgImpact = Math.sign(chg) > 0 ? 'up' : 'down';
        sendUserInfo[email] = { gainers, losers, yhigh: yhighList, ylow: ylowList, chg, chgAmount, chgImpact };
      });
      console.log(sendUserInfo);
      await sendMessage(sendUserInfo, process.env.PRICE_ALERTS_QUEUE);
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await processData();
};
