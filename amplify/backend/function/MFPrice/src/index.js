/* Amplify Params - DO NOT EDIT
	API_GOALS_GRAPHQLAPIENDPOINTOUTPUT
	API_GOALS_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const mfData = require("india-mutual-fund-info");
const { pushData, pushDataForFeed } = require("/opt/nodejs/insertIntoDB");
const { directISIN, getDirISIN } = require("./data");
const { getType, getSubType, mfType, mCap, getName } = require("./calculate");
const table = "INMutual-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";

const getData = () => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let isinMap = {};
    let count = 0;
    const mfInfoArray = await mfData.today();
    const regdirData = directISIN(mfInfoArray);
    const { regularData, directData } = regdirData;
    mfInfoArray.map((element) => {
      const id = element["ISIN Div Payout/ ISIN Growth"];
      const price = parseFloat(element["Net Asset Value"]);
      if (
        id.length < 12 ||
        element["Scheme Type"].includes("ETF") ||
        element["Scheme Name"].includes("ETF") ||
        Number.isNaN(price) ||
        isinMap[id]
      )
        return;
      const dataToPush = {
        __typename: table.slice(0, table.indexOf("-")),
        id: id,
        sid: element["Scheme Code"],
        tid: element["ISIN Div Reinvestment"],
        dir: getDirISIN(regularData, directData, element),
        name: getName(element),
        type: getType(element),
        subt: getSubType(element),
        price: price,
        mftype: mfType(element["Scheme Type"]),
        mcap: mCap(element["Scheme Type"]),
        tf: element["Scheme Name"].includes("Tax") ? "Y" : "N",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
  const data = await getData();
  for (let batch in data) {
    await pushData(data[batch], table);
  }
  await pushDataForFeed(table, data);
};
