const mfData = require("india-mutual-fund-info");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
  appendGenericFields,
} = require("/opt/nodejs/databaseUtils");
const { utility } = require("/opt/nodejs/utility");
const { directISIN, getDirISIN } = require("./data");
const {
  getType,
  getSubType,
  mfType,
  mcap,
  getName,
  calculateRisk,
} = require("./calculate");
const table = "INMFPrice";

let prev = 1;
const getInfo = async () => {
  let mfInfoArray = {};
  const { date, monthChar, yearFull } = utility(prev);
  const prevDate = new Date(`${date} ${monthChar} ${yearFull}`);
  const isWeekend = (date) => date.getDay() % 6 == 0;
  try {
    mfInfoArray = await mfData.history(prevDate, new Date());
    if (mfInfoArray.length < 8000) return;
  } catch (error) {
    console.log(error);
  }
  if (mfInfoArray.length < 2000 && !isWeekend) {
    prev++;
    await getInfo();
  }
  const prevInfoMap = {};
  const currInfoArray = [];
  mfInfoArray.forEach((element) => {
    const date = new Date(element["Date"]);
    const id = element["ISIN Div Payout/ISIN Growth"];
    const price = parseFloat(element["Net Asset Value"]);
    if (!id || id.length < 12 || Number.isNaN(price)) return;
    if (date.toDateString() === prevDate.toDateString()) {
      prevInfoMap[id] = parseFloat(price);
    } else if (
      date.toDateString() === new Date().toDateString()
    ) {
      currInfoArray.push(element);
    }
  });
	console.log("CurrInfoArray", currInfoArray.length);
	console.log("PrevInfoMap", Object.keys(prevInfoMap).length);
  return { prevInfoMap, currInfoArray };
};

const getData = () => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let isinMap = {};
    let count = 0;
    const data = await getInfo();
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

exports.handler = async (event) => {
  const tableName = await getTableNameFromInitialWord(table);
  console.log("Table name fetched: ", tableName);
  const data = await getData();
  if (!data) return;
	console.log(data.length);
  for (let batch in data) {
    await pushData(data[batch], tableName);
  }
  await pushDataForFeed(table, data);
};
