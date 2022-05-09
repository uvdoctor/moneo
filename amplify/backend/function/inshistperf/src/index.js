// const {
//   getTableNameFromInitialWord,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { getTableNameFromInitialWord } = require("/opt/nodejs/databaseUtils");
const { getExchgData, getFundData } = require("./getData");
const table = "InsHistPerf";

const getAndPushData = async () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const yearsList = [365, 365 * 3, 365 * 5];
    try {
      await getExchgData(yearsList, tableName);
      await getFundData(yearsList, tableName);
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
