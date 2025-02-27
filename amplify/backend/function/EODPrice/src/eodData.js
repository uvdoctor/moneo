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
    const { statusText, status } = error.response;
    if (
      statusText.toString().includes("Payment Required") &&
      Number(status.toString()) == 402
    ) {
      if (index <= apiKeys.eodhistoricaldata.length - 1) {
        index++;
        return await getData(element, index);
      }
    }
    console.log(status);
  }
};

module.exports = getData;
