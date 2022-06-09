// const {
//   getIndexList,
//   getIndexComponents,
// } = require("../../moneopricelayer/lib/nodejs/eod");
// const {
//   divideArrayBySize,
//   appendGenericFields
// } = require("../../moneoutilslayer/lib/nodejs/utility");
// const {
//   getTableNameFromInitialWord,
//   pushData,
//   pushDataForFeed,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { getIndexList, getIndexComponents } = require("/opt/nodejs/eod");
const {
  divideArrayBySize,
  appendGenericFields,
} = require("/opt/nodejs/utility");
const {
  getTableNameFromInitialWord,
  pushData,
  pushDataForFeed,
} = require("/opt/nodejs/databaseUtils");
const table = "IndexConst";

const arrangeData = async (indexList) => {
  const batch = [];
  for (let element of indexList) {
    const data = await getIndexComponents(element.Code);
    const comp = [];
    Object.keys(data).map((item) => {
      const ele = data[item];
      comp.push(ele.Code);
    });
    if (!comp.length) continue;
    const schema = {
      name: element.Name,
      comp,
    };
    appendGenericFields(schema, table);
    batch.push({ PutRequest: { Item: schema } });
  }
  return batch;
};

const getAndPushData = async () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    let indexList = await getIndexList();
    indexList = indexList.filter((item) => {
      const name = item.Name.toLowerCase();
      return name.includes("nifty");
    });
    try {
      const batch = await arrangeData(indexList);
      const batches = divideArrayBySize(batch, 25);
      for (let batch in batches) {
        const result = await pushData(batches[batch], tableName);
        console.log(result);
      }
      const response = await pushDataForFeed(table, batches, `NSE`, "", "NSE");
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getAndPushData, arrangeData };
