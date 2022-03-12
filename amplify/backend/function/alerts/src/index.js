const {
  getDataFromTable,
  batchReadItem,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/databaseUtils");
const { divideArrayBySize } = require("/opt/nodejs/utility");
const { getInstrumentsValuation } = require("/opt/nodejs/alertsVal");
const { sendMessage } = require("/opt/nodejs/sqsUtils");

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
      const usermap = {};
      const infoMap = {};

      // UserIns data
      let mfIds = new Set();
      let otherIds = new Set();
      const userinsTableName = await getTableNameFromInitialWord("UserIns");
      const userinsdata = await getDataFromTable(
        userinsTableName,
        "uname, ins"
      );
      for (let item of userinsdata) {
        usermap[item.uname] = item.ins;
        for (let ins of item.ins) {
          if (ins.id.startsWith("INF")) mfIds.add(ins.id);
          else otherIds.add(ins.id);
        }
      }
      const users = Object.keys(usermap);

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
      const valuationMap = getInstrumentsValuation(infoMap);

      // user email
      const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
      let userKeys = [];
      let userdata = [];
      users.map((uname) => userKeys.push({ uname: uname }));
      const userBatchKeys = divideArrayBySize(userKeys, 100);
      for (let batch of userBatchKeys) {
        const results = await batchReadItem(userInfoTableName, batch);
        userdata = [...results, ...userdata];
      }

      let sendUserInfo = {};
      for (let user of users) {
        const userInfo = userdata.find((re) => re.uname === user);
        sendUserInfo[userInfo.email] = {
          yhigh: [],
          ylow: [],
          gainers: [],
          losers: [],
        };
        usermap[user].forEach((item) => {
          const data = valuationMap[item.id];
          if (!data) return;
          const { name } = data;
          const { yhigh, ylow, gainers, losers } = sendUserInfo[userInfo.email];
          if (data["yhigh"]) yhigh.push({ name: name, val: data.yhigh });
          if (data["ylow"]) ylow.push({ name: name, val: data.ylow });
          if (data["gainers"]) gainers.push({ name: name, val: data.gainers });
          if (data["losers"]) losers.push({ name: name, val: data.losers });
        });
        const { yhigh, ylow, gainers, losers } = sendUserInfo[userInfo.email];
        if (!yhigh.length && !ylow.length && !gainers.length && !losers.length)
          delete sendUserInfo[userInfo.email];
      }
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
