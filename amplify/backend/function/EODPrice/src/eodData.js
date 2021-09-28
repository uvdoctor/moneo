const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
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

const getDiamondPrice = async (batches, table) => {
  const response = await axios.get(
    "https://www.gold-rate.co.in/diamond-prices/united-states-diamond-price-today/"
  );
  const dom = new JSDOM(response.data);
  let result = dom.window.document.querySelector(
    "table.ts > tbody > tr:nth-child(7) > td:nth-child(2)"
  ).textContent;
  result = result.slice(result.indexOf(" ") + 1, result[-1]);
  result = result.replace("," , "")
  const dataToPush = {
    __typename: table.slice(0, table.indexOf("-")),
    id: "DIAM",
    price: Number(result),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  batches.push({ PutRequest: { Item: dataToPush } });
};

module.exports = {
  getData,
  getDiamondPrice,
};
