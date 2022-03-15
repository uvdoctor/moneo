const {
  getTableNameFromInitialWord,
  filterTableByList,
} = require("/opt/nodejs/databaseUtils");
const {
  instrumentValuation,
  holdingValuation,
  calculateDiffPercent,
  toCurrency
} = require("/opt/nodejs/alertsVal");
const { sendMessage } = require("/opt/nodejs/sqsUtils");
const { processHoldings, processInstruments } = require("./data");

const processData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersinsMap = {};
      const usersholdingMap = {};
      const infoMap = {};
      let sendUserInfo = {};
      const usersMap = {};

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

      userinfodata.map((item) => (usersMap[item.uname] = item.email));
      await processInstruments(infoMap, usersMap, usersinsMap);
      const { pmArray, cryptoAndCommodity } = await processHoldings(
        infoMap,
        usersMap,
        usersholdingMap
      );

      Object.keys(usersMap).map((user) => {
        let prev = 0;
        let price = 0;
        const email = usersMap[user];
        let { gainers, losers, yhighList, ylowList, totalPrev, totalPrice } =
          instrumentValuation(infoMap, usersinsMap[user]);
        prev += totalPrev;
        price += totalPrice;

        let { totalHoldingsPrev, totalHoldingsPrice } = holdingValuation(
          infoMap,
          usersholdingMap[user],
          pmArray
        );
        prev += totalHoldingsPrev;
        price += totalHoldingsPrice;

        const chgAmount = toCurrency((price - prev),"INR", true)
        const chg = calculateDiffPercent(price, prev);
        const chgImpact = Math.sign(chg) > 0 ? "up" : "down";
        sendUserInfo[email] = {
          gainers,
          losers,
          yhigh: yhighList,
          ylow: ylowList,
          chg,
          chgAmount,
          chgImpact,
          metal: cryptoAndCommodity,
        };
      });
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
