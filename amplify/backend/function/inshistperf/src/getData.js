const mfData = require("india-mutual-fund-info");
// const { getEODdataByDate } = require("../../moneopricelayer/lib/nodejs/eod");
// const { divideArrayBySize, utility } = require("../../moneoutilslayer/lib/nodejs/utility");
// const {
//   pushData,
//   pushDataForFeed,
//   appendGenericFields,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { getEODdataByDate } = require("/opt/nodejs/eod");
const { divideArrayBySize, utility, appendGenericFields } = require("/opt/nodejs/utility");
const {
  pushData,
  pushDataForFeed
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

const getFundData = async (yearsList, tableName) => {
  const fundIds = {};
  const p1y = [];
  const p3y = [];
  const p5y = [];
  for (let year of yearsList) {
    const isinMap = {};
    const mfInfoArray = await getInfo(year);
    mfInfoArray.forEach((element) => {
      const id = element["ISIN Div Payout/ISIN Growth"];
      const price = parseFloat(element["Net Asset Value"]);
      if (!id || id.length < 12 || Number.isNaN(price) || !price) return;
      if (isinMap[id]) return;
      isinMap[id] = id;
      if (!fundIds[id]) fundIds[id] = id;
      if (year === 365) p1y.push({ id, price });
      if (year === 365 * 3) p3y.push({ id, price });
      if (year === 365 * 5) p5y.push({ id, price });
    });
  }
  const batch = arrangeAndPushData(fundIds, p1y, p3y, p5y, tableName, "Fund");
  return batch;
};

const getExchgData = async (yearsList, tableName) => {
  const p1y = [];
  const p3y = [];
  const p5y = [];
  const exchgIds = {};
  const exchgs = ["NSE", "BSE"];
  for (let year of yearsList) {
    const isinMap = {};
    for (let exchg of exchgs) {
      const data = await getEODdataByDate(exchg, year);
      data.map((item) => {
        if (isinMap[item.code]) return;
        if (!exchgIds[item.code]) exchgIds[item.code] = item.code;
        isinMap[item.code] = item.code;
        const id = item.code;
        const price = item.adjusted_close;
        if (!price || isNaN(price)) return;
        if (year === 365) p1y.push({ id, price });
        if (year === 365 * 3) p3y.push({ id, price });
        if (year === 365 * 5) p5y.push({ id, price });
      });
    }
  }

  const batch = arrangeAndPushData(exchgIds, p1y, p3y, p5y, tableName, "Exchg");
  return batch;
};

module.exports = { getExchgData, getFundData };
