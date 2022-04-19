const {
  getTableNameFromInitialWord,
  filterTableByList,
} = require("/opt/nodejs/databaseUtils");
const { instrumentValuation } = require("/opt/nodejs/alertsVal");
const { sendMessage } = require("/opt/nodejs/sqsUtils");
const { toHumanFriendlyCurrency } = require("/opt/nodejs/utility");
const { watchlistValuation } = require("/opt/nodejs/watchlistVal");
const {
  processHoldings,
  processInstruments,
  getCommodityList,
} = require("./data");

const processData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersinsMap = {};
      const usersWatchMap = {};
      const infoMap = {};
      const usersMap = {};
      const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
      const userinfodata = await filterTableByList(
        userInfoTableName,
        [
          "investments.doctor@gmail.com",
          "emailumangdoctor@gmail.com",
          "mehzabeen1526@gmail.com",
          "ravinder.singh.rawat2008@gmail.com",
          "nipathakarbank@gmail.com",
          "hareshpatel13@gmail.com",
"hardikpanchal19@gmail.com",
"patel_parthindia@yahoo.co.in",
"jigneshlaxmi@yahoo.co.in",
"rahul.bariya17@gmail.com",
"snehal.limbachiya@yahoo.com",
"gopigajera4545@gmail.com",
"bhaveshdesai19842@gmail.com",
"morli1469@gmail.com",
"kv93001@gmail.com",
"maniarnishit08@gmail.com",
"darshpanchcoin@gmail.com",
"gnilesh2707@gmail.com",
"jaymodi495@gmail.com",
"jaiminpatel.patel88@gmail.com",
"chetannai1493@gmail.com",
"shivam73597@gmail.com",
"kishan09rajpurohit@gmail.com",
"digesh.joshi138@gmail.com",
"twinklemodasiya78@gmail.com",
"radhikajakhaniya15@gmail.com",
"sarveshraval2711@gmail.com",
"hiteshmacwan7777@gmail.com",
"sutharhiten1999@gmail.com",
"fk9503642@gmail.com",
"sanjayrabari972@gmail.com",
"himm42248@gmail.com",
"dipeshdip77@gmail.com",
"riddhipatel8011@gmail.com",
"divyank.geryani@gmail.com",
"ashpadhiyar1998@gmail.com",
"jigsamin4274@gmail.com",
"1mamtakoshti@gmail.com",
"sarvang.dave@theporter.in",
"1jayjoshi1@gmail.com",
"patelhelly1410@gmail.com",
"saksena609@gmail.com",
"desaikajal2503@gmail.com",
"vaghela.markand1985@gmail.com",
"tjshyam786@gmail.com",
"dineshprajapati964@gmail.com",
"mkkuril1@gmail.com",
"guess.manan1983@gmail.com",
"shekhaliyakrishna@gmail.com",
"vishal3006@gmail.com",
"harshil.vakhariya143@gmail.com"
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
      await processInstruments(infoMap, usersMap, usersinsMap, usersWatchMap);
      await processHoldings(infoMap, usersMap, usersinsMap);
      const commodityList = await getCommodityList();
      const users = Object.keys(usersMap);
      for (let user of users) {
        const email = usersMap[user];
        if (usersinsMap[user]?.length) {
          let { gainers, losers, yhighList, ylowList, totalPrev, totalPrice } =
            instrumentValuation(infoMap, usersinsMap[user]);
          const chgAmount = toHumanFriendlyCurrency(
            Math.abs(totalPrice - totalPrev),
            "INR"
          );
          const chgImpact = Math.sign(totalPrice - totalPrev) > 0;
          const sendUserInfo = {
            email,
            gainers,
            losers,
            yhigh: yhighList,
            ylow: ylowList,
            valuation: toHumanFriendlyCurrency(totalPrice, "INR"),
            chgAmount,
            chgImpact,
            metal: commodityList,
          };
          await sendMessage(sendUserInfo, process.env.PRICE_ALERTS_QUEUE);
        }
        if (usersWatchMap[user]?.length) {
          let { buy, sell } = watchlistValuation(infoMap, usersWatchMap[user]);
          const sendUserInfo = { email, buy, sell };
          await sendMessage(sendUserInfo, process.env.WATCH_ALERTS_QUEUE);
        }
      }
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await processData();
};
