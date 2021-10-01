const { pushData, pushDataForFeed } = require("/opt/nodejs/insertIntoDB");
const eodData = require("./eodData");
const apiListData = require("./apiList");
const { commodityAbbr, cryptoAbbr, currencyAbbr, apiToCall } = apiListData;
const { getData, getDiamondPrice } = eodData;
const table = "EODPrices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
let batchRecords = [];

const eodPrice = () => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let idsToLog = [];
    let count = 0;
    const data = await getDiamondPrice(table);
    console.log(data);
    batches.push({ PutRequest: { Item: data } });
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

        const dataToPush = {
          __typename: table.slice(0, table.indexOf("-")),
          id: code,
          price: close,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
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
  for (let batch in data) {
    const results = await pushData(data[batch], table);
    console.log(results);
  }
  await pushDataForFeed(table, data);
};
