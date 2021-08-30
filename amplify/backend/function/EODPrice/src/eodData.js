const docClient = require("./insertIntoDB");
const axios = require("axios");
const eodApiKey = process.env.EOD_API_KEY;

const apiKeys = {
  eodhistoricaldata: eodApiKey.split(","),
};

const eodURL = (name, type, token) =>
  `https://eodhistoricaldata.com/api/real-time/${name}.${type}?api_token=${token}&fmt=json`;

const getData = async (element, index) => {
  try {
    let token = apiKeys.eodhistoricaldata[index];
    const { data } = await axios.get(eodURL(element.name, element.type, token));
    return data;
  } catch (error) {
    const errMessage = error.response.statusText.toString();
    const errCode = error.response.status.toString();
    if (errMessage.includes("Payment Required") && errCode == 402) {
      if (index <= apiKeys.eodhistoricaldata.length - 1) {
        index++;
        return await getData(element, index);
      }
    }
    console.log(error.response.status);
  }
};

const pushData = async (data, table) => {
  return new Promise((resolve, reject) => {
    const result = new Array(Math.ceil(data.length / 25))
      .fill()
      .map((_) => data.splice(0, 25));

    result.filter(async (bunch) => {
      var params = {
        RequestItems: {
          [table]: bunch,
        },
      };
      try {
        const details = await docClient.batchWrite(params).promise();
        console.log(details);
        resolve(details);
      } catch (error) {
        reject(`Error in dynamoDB: ${JSON.stringify(error)}`);
      }
    });
  });
};

module.exports = {
  getData,
  pushData,
};
