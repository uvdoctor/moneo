const {
  getEODdataByDate,
} = require("../../moneopricelayer/lib/nodejs/eod");
const {
  divideArrayBySize,
} = require("../../moneoutilslayer/lib/nodejs/utility");
const {
  getTableNameFromInitialWord,
  pushData,
  pushDataForFeed,
	appendGenericFields,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const { getIndexList, getIndexComponents } = require("/opt/nodejs/eod");
// const { divideArrayBySize } = require("/opt/nodejs/utility");
// const {
//   getTableNameFromInitialWord,
//   pushData,
//   pushDataForFeed,
//   appendGenericFields
// } = require("/opt/nodejs/databaseUtils");
const table = "InsHistPerf";

const getAndPushData = async () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const batch = [];
    const p1y = [];
    const p3y = [];
    const p5y = [];
    const code = {};
    const exchgs = ["NSE", "BSE"];
    const yearsCount = [365, 365 * 3, 365 * 5];
    try {
      for (let year of yearsCount) {
        const isinMap = {};
        for (let exchg of exchgs) {
          const data = await getEODdataByDate(exchg, year);
          data.map((item) => {
            if (isinMap[item.code]) return;
            if (!code[item.code]) {
              code[item.code] = item.code;
            }
            isinMap[item.code] = item.code;
            if (year === 365) {
              p1y.push({ code: item.code, price: item.adjusted_close });
            }
            if (year === 365 * 3) {
              p3y.push({ code: item.code, price: item.adjusted_close });
            }
            if (year === 365 * 5) {
              p5y.push({ code: item.code, price: item.adjusted_close });
            }
          });
        }
      }

      Object.keys(code).map((key) => {
        const p1 = p1y.find((item) => item.code === key);
        const p3 = p3y.find((item) => item.code === key);
        const p5 = p5y.find((item) => item.code === key);
        const schema = { id: key };
        if (p1) schema.p1y = p1.price;
        if (p3) schema.p3y = p3.price;
        if (p5) schema.p5y = p5.price;
				appendGenericFields(schema, tableName)
				console.log(schema);
        batch.push({ PutRequest: { Item: schema } });
      });

      const batches = divideArrayBySize(batch, 25);

      for (let batch in batches) {
        const result = await pushData(batches[batch], tableName);
        console.log(result);
      }
      await pushDataForFeed(table, batches, `Inshistpref`, "", "");
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
