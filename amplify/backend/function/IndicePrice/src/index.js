/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const pushData = require("/opt/nodejs/insertIntoDB"); 
const apiArray = require("./utils");
const getData = require("./getandpushData");
const table = "Indices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";

const getAndPushData = async () => {
  for (let i = 0; i < apiArray.length; i++) {
    try {
      const { url } = apiArray[i];
      const data = await getData(url, table);
      for (let batch in data) {
        console.log(data[batch][0].PutRequest)
        const results = await pushData(data[batch], table, batch);
        console.log(results);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

exports.handler = async (event) => {
  return await getAndPushData();
};
