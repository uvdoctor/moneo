const graphqlOperation = require("./operation");
const axios = require("axios");
const eodApiKey = process.env.EOD_API_KEY;
const cryptoAbbr = "CC";
const currencyAbbr = "FOREX";
const commodityAbbr = "COMM";

const apiKeys = {
  eodhistoricaldata: eodApiKey.split(","),
};

const eodURL = (name, type, token) =>
  `https://eodhistoricaldata.com/api/real-time/${name}.${type}?api_token=${token}&fmt=json`;

const apiToCall = [
  {
    name: "BTC-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "LTC-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "ETH-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "XRP-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "DASH-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "XMR-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "ETC-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "BCH-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "DOGE-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "XLM-USD",
    type: cryptoAbbr,
    fieldName: "close",
  },
  {
    name: "EUR",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "INR",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "AUD",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "CAD",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "JPY",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "CNY",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "CHF",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "GBP",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "SEK",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "NZD",
    type: currencyAbbr,
    fieldName: "close",
  },
  {
    name: "GC",
    type: commodityAbbr,
    fieldName: "close",
  },
  {
    name: "PL",
    type: commodityAbbr,
    fieldName: "close",
  },
  {
    name: "SI",
    type: commodityAbbr,
    fieldName: "close",
  },
  {
    name: "PA",
    type: commodityAbbr,
    fieldName: "close",
  },
];

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

const pushData = async (code, close) => {
  const alreadyInsertedData = await graphqlOperation(
    { Limit: 10000 },
    "ListEodPricess"
  );

  const insertedData =
    await alreadyInsertedData.body.data.listEODPricess.items.some(
      async (result) => {
        return await graphqlOperation(
          { id: code, price: close, name: code },
          result.id === code ? "UpdateEodPrices" : "CreateEodPrices"
        );
      }
    );

  console.log("Operation result:", insertedData.body);
  return insertedData;
};

module.exports = {
  cryptoAbbr,
  commodityAbbr,
  apiToCall,
  getData,
  pushData,
};
