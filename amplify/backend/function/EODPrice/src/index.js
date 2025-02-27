/* Amplify Params - DO NOT EDIT
	API_GOALS_GRAPHQLAPIENDPOINTOUTPUT
	API_GOALS_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	AUTH_MONEO3E6273BC_USERPOOLID
	ENV
	REGION
// Amplify Params - DO NOT EDIT */
const { pushData, pushDataForFeed, appendGenericFields, getTableNameFromInitialWord } = require("/opt/nodejs/insertIntoDB");
const eodData = require("./eodData");
const apiListData = require("./apiList");
const { commodityAbbr, cryptoAbbr, currencyAbbr, apiToCall } = apiListData;
const getData = eodData;
const table = "EODPrices";
let batchRecords = [];

const eodPrice = () => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let idsToLog = [];
    let count = 0;
    await Promise.all(
      apiToCall.map(async (element) => {
        let { code, close } = await getData(element, 0);

        switch (element.type) {
          case commodityAbbr:
            close = Number((close / 31.1).toFixed(2));
            code = code.slice(0, code.lastIndexOf("."));
            break;
          case cryptoAbbr:
            code = code.slice(0, code.lastIndexOf("-"));
            break;
          default:
            code = code.slice(0, code.lastIndexOf("."));
            break;
        }

        let dataToPush = {
          id: code,
          price: close,
        };
        dataToPush = appendGenericFields(dataToPush, table);
        idsToLog.push(code);
        batches.push({ PutRequest: { Item: dataToPush } });

        count++;
        if (count === 25) {
          batchRecords.push(batches);
          batches = [];
          count = 0;
        }
      })
    );
    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    console.log("Data to update:", idsToLog);
    resolve(batchRecords);
  });
};

exports.handler = async (event) => {
  let data = await eodPrice();
  const tableName = await getTableNameFromInitialWord(table);
	console.log('Table name fetched: ', tableName);
  for (let batch in data) {
    const results = await pushData(data[batch], tableName);
    console.log(results);
  }
  await pushDataForFeed(table, data);
};
