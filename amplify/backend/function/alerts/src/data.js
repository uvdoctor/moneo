const {
  batchReadItem,
  getTableNameFromInitialWord,
  filterTableByList,
} = require("/opt/nodejs/databaseUtils");
const { divideArrayBySize, utility } = require("/opt/nodejs/utility");
const { getCommodityPrice, getCryptoPrice, getFXRate } = require("/opt/nodejs/eod");
const { convertTroyOunceToGram, calculateDiffPercent } = require("/opt/nodejs/alertsVal");

const metals = {
  GC: "Gold",
  SI: "Silver",
  PL: "Platinum",
  PA: "Palladium",
};

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

const processInstruments = async (infoMap, usersMap, usersinsMap) => {
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

  if (mfIds.size) {
    await getInstrumentsData(mfIds, "INMFPrice", infoMap);
  }
  mfIds.forEach((id) => otherIds.add(id));

  if (otherIds.size) {
    await getInstrumentsData(otherIds, "INExchgPrice", infoMap);
  }

  if (otherIds.size) {
    await getInstrumentsData(otherIds, "INBondPrice", infoMap);
  }
};

const processHoldings = async (infoMap, usersMap, usersholdingMap) => {
  let cryptoAndCommodity = [];
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
    usersholdingMap[item.uname] = [...item.nps, ...item.pm, ...item.crypto];
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

  if (npsIds.size) {
    await getInstrumentsData(npsIds, "NPSPrice", infoMap);
  }

  const { date, month, yearFull } = utility(1);
  const fromDate = `${yearFull}-${month}-${date}`;
  const fxRate = await getFXRate("INR");
  const convertUSDToINR = (amt) => fxRate * convertTroyOunceToGram(amt);

  const pmArray = [...pmIds];
  if (pmIds.size) {
    for (let ids of pmArray) {
      const data = await getCommodityPrice(ids, fromDate);
      infoMap[ids] = {
        prev: convertUSDToINR(data[0]),
        price: convertUSDToINR(data[1]),
      };
      const diff = calculateDiffPercent(infoMap[ids].price, infoMap[ids].prev);
      cryptoAndCommodity.push({
        name: metals[ids],
        price: convertUSDToINR(data[1]),
        chg: diff,
        up: Math.sign(diff) > 0 ? true : false,
      });
    }
  }

  // Crytpo
  const cryptoArray = [...cryptoIds];
  if (cryptoIds.size) {
    // for (let ids of cryptoArray) {
    //   const data = await getCryptoPrice(ids, fromDate);
    //   infoMap[ids] = { prev: convertUSDToINR(data[0]), price: convertUSDToINR(data[1]) };
    // }
    // const diff = calculateDiffPercent(infoMap[ids].price, infoMap[ids].prev)
    // cryptoAndCommodity.push({ name: ids, price, chg: diff, up: Math.sign(diff) > 0 ? true : false })
  }

  return { pmArray, cryptoAndCommodity };
};

module.exports = { getInstrumentsData, processInstruments, processHoldings };
