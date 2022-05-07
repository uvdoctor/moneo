// const { utility } = require("../../moneoutilslayer/lib/nodejs/utility");
// const { getTableNameFromInitialWord, pushDataForFeed, pushData } = require('../../moneoutilslayer/lib/nodejs/databaseUtils')
const { utility } = require("/opt/nodejs/utility");
const {
  getTableNameFromInitialWord,
  pushDataForFeed,
  pushData,
} = require("/opt/nodejs/databaseUtils");
const { getData } = require("./getData");
const table = "IndiceHistPerf";

const getAndPushData = async () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const { monthChar, yearFull } = utility(30);
    const url = `https://www1.nseindia.com/content/indices/Index_Dashboard_${monthChar}${yearFull}.pdf`;
    console.log(url);
    try {
      const batches = await getData(url, table);
      console.log(batches.length);
      for (let batch in batches) {
        const result = await pushData(batches[batch], tableName);
        console.log(result);
      }
      await pushDataForFeed(table, batches, "NSE-IndiceHistPref", url, "NSE");
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
