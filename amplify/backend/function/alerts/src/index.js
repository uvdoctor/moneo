const {
  getTableNameFromInitialWord,
  filterTableByList,
} = require("/opt/nodejs/databaseUtils");
const {
  instrumentValuation,
} = require("/opt/nodejs/alertsVal");
const { sendMessage } = require("/opt/nodejs/sqsUtils");
const { toHumanFriendlyCurrency } = require("/opt/nodejs/utility");
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
        const { commodityList } = await processHoldings(
        infoMap,
        usersMap,
        usersholdingMap,
        usersinsMap
      );

      Object.keys(usersMap).map((user) => {
        let prev = 0;
        let price = 0;
        const email = usersMap[user];
        let { gainers, losers, yhighList, ylowList, totalPrev, totalPrice } =
          instrumentValuation(infoMap, usersinsMap[user]);
        prev += totalPrev;
        price += totalPrice;
        const chgAmount = toHumanFriendlyCurrency(Math.abs(price - prev),"INR")
        const chgImpact = Math.sign(price - prev) > 0 ? true : false;
        sendUserInfo[email] = {
          gainers,
          losers,
          yhigh: yhighList,
          ylow: ylowList,
          chgAmount,
          chgImpact,
          metal: commodityList,
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
