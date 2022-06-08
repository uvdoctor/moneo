// const {
//   appendGenericFields,
// } = require("../../moneoutilslayer/lib/nodejs/utility");
const { appendGenericFields } = require("/opt/nodejs/utility");
const {
  getType,
  getSubType,
  mfType,
  mcap,
  getName,
  calculateRisk,
  directISIN,
  getDirISIN,
} = require("./calculate");
const { arrangeData } = require("./arrangeData");
const table = "INMFPrice";

const getData = () => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let isinMap = {};
    let count = 0;
    const data = await arrangeData();
    if (!data) resolve();
    const { prevInfoMap, currInfoArray } = data;
    const regdirData = directISIN(currInfoArray);
    const { regularData, directData } = regdirData;
    currInfoArray.map((element) => {
      const id = element["ISIN Div Payout/ISIN Growth"];
      const price = parseFloat(element["Net Asset Value"]);
      if (
        element["Scheme Type"].includes("ETF") ||
        element["Scheme Name"].includes("ETF") ||
        isinMap[id]
      )
        return;
      let dataToPush = {
        id: id,
        sid: element["Scheme Code"],
        tid: element["ISIN Div Reinvestment"],
        dir: getDirISIN(regularData, directData, element),
        name: getName(element),
        type: getType(element),
        subt: getSubType(element),
        price: price,
        mftype: mfType(element["Scheme Type"]),
        mcapt: mcap(element),
        tf: element["Scheme Name"].includes("Tax") ? true : false,
        prev: prevInfoMap[id],
      };
      dataToPush.risk = calculateRisk(dataToPush.subt, dataToPush.mcapt);
      dataToPush = appendGenericFields(dataToPush, table);
      batches.push({ PutRequest: { Item: dataToPush } });
      isinMap[id] = id;
      count++;
      if (count === 25) {
        batchRecords.push(batches);
        batches = [];
        count = 0;
      }
    });
    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    resolve(batchRecords);
  });
};

module.exports = { getData };
