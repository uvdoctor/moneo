/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const {docClient, pushData} = require("/opt/nodejs/insertIntoDB"); 
const apiArray = require("./utils");
const getData = require("./getData");
const table = "Indices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";

const getAndPushData = async () => {
  for (let i = 0; i < apiArray.length; i++) {
    try {
      const { url } = apiArray[i];
      const data = await getData(url, table);
      for (let batch in data) {
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
