/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */const mfData = require("india-mutual-fund-info");
const dataInfo = require("./data");
const {
  getDirISIN,
  directISIN,
  getAssetSubType,
  getAssetType,
  mfType,
  pushData,
  mCap,
} = dataInfo;
const table = "INMutual-bvyjaqmusfh5zelcbeeji6xxoe-dev";
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
        name: element["Scheme Name"],
        type: getAssetType(element["Scheme Type"]),
        subt: getAssetSubType(element),
        price: price,
        mftype: mfType(element["Scheme Type"]),
        mcap: mCap(element),
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

    resolve(batchRecords);
  });
};

exports.handler = async (event) => {
  const data = await getData();
  for (let batch in data) {
    await pushData(data[batch], table, batch);
  }
};
