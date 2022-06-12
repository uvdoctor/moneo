const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/databaseUtils");
const { getFundamentalDataByLimit } = require("/opt/nodejs/eod");
// const {
//   pushData,
//   pushDataForFeed,
//   getTableNameFromInitialWord,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const { getFundamentalDataByLimit } = require("../../moneopricelayer/lib/nodejs/eod");
const { calculateSchema } = require("./calculate");
const table = "INExchgFun";
const isinMap = {};

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const exchgList = ["NSE", "BSE"];
    const offset = [0, 500, 1000, 1500];
    try {
      for (let exchg of exchgList) {
        for (let i = 0; i < offset.length; i++) {
          const { data, url } = await getFundamentalDataByLimit(
            exchg,
            offset[i]
          );
          const batches = calculateSchema(data, isinMap, exchg, table);
          console.log(batches);
          for (let batch in batches) {
            const result = await pushData(batches[batch], tableName);
            console.log(result);
          }
          await pushDataForFeed(table, batches, `${exchg}-${i}`, url, exchg);
        }
      }
    resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getAndPushData };