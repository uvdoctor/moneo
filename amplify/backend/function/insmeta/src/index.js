/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const apiArray = require("./utils");
const { getData, pushData } = require("./get&pushData");
const table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const isinMap = {};
const batchRecords = [];
const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        const { url, mcap, indices } = apiArray[i];
        const data = await getData(
          url,
          mcap,
          indices,
          isinMap,
          table,
          batchRecords
        );
        for (let batch in data) {
          await pushData(data[batch], table, batch);
        }
      } catch (err) {
        reject(err);
      }
    }
    console.log(batchRecords.length);
    resolve();
  });
};

getAndPushData();
exports.handler = async (event) => {
  return await getAndPushData();
};
