const mfData = require("india-mutual-fund-info");
// const { divideArrayBySize, utility, appendGenericFields } = require("../../moneoutilslayer/lib/nodejs/utility");
// const {
//   pushData,
//   pushDataForFeed,
// getTableNameFromInitialWord
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { getExchgData, getFundData } = require('./getData')
const { divideArrayBySize, utility, appendGenericFields } = require("/opt/nodejs/utility");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord
} = require("/opt/nodejs/databaseUtils");
const table = "InsHistPerf";

let mfInfoArray = [];
const getInfo = async (prev) => {
  const { date, monthChar, yearFull } = utility(prev);
  const prevDate = new Date(`${date} ${monthChar} ${yearFull}`);
  const isWeekend = (date) => date.getDay() % 6 === 0;
  try {
    mfInfoArray = await mfData.history(prevDate, prevDate);
  } catch (error) {
    console.log(error);
  }
  if (mfInfoArray.length < 2000 || isWeekend(prevDate)) {
    prev++;
    await getInfo(prev);
  }
  return mfInfoArray;
};

const arrangeAndPushData = async (ids, p1y, p3y, p5y, tableName, type) => {
  const batch = [];
  Object.keys(ids).map((key) => {
    const p1 = p1y.find((item) => item.id === key);
    const p3 = p3y.find((item) => item.id === key);
    const p5 = p5y.find((item) => item.id === key);
    const schema = { id: key, p1y: 0, p3y: 0, p5y: 0 };
    if (!p1) return;
    if (p1) schema.p1y = p1.price;
    if (p3) schema.p3y = p3.price;
    if (p5) schema.p5y = p5.price;
    appendGenericFields(schema, tableName);
    batch.push({ PutRequest: { Item: schema } });
  });
  const batches = divideArrayBySize(batch, 25);
  for (let batch in batches) {
    const result = await pushData(batches[batch], tableName);
    console.log(result);
  }
  await pushDataForFeed(table, batches, type, "", "");
};

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

module.exports = { getAndPushData, getInfo, arrangeAndPushData };
