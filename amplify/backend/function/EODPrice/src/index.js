const graphqlOperation = require("./operation");
const axios = require("axios");
const eodApiKey = process.env.EOD_API_KEY;
const eodApiKeyArray = eodApiKey.split(",");
const cryptoAbbr = "CC";
const currencyAbbr = "FOREX";
const commodityAbbr = "COMM";

const eodURL = (name, type, apiToken) =>
  `https://eodhistoricaldata.com/api/real-time/${name}.${type}?api_token=${apiToken}&order=d&fmt=json`;

// apiURL = {
//   name :[],
//   type:[],
//   url:
// }
const apiURL = [
  {
    name: "BTC-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "LTC-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "ETH-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "XRP-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "DASH-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "XMR-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "ETC-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "BCH-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "DOGE-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "XLM-USD",
    type: cryptoAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "EUR",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "INR",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "AUD",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "CAD",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "JPY",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "CNY",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "CHF",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "GBP",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "SEK",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "NZD",
    type: currencyAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "GC",
    type: commodityAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "PL",
    type: commodityAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "SI",
    type: commodityAbbr,
    url: eodApiKeyArray[0],
  },
  {
    name: "PA",
    type: commodityAbbr,
    url: eodApiKeyArray[0],
  },
];

eodCurrenciesPrice = () => {
  return new Promise(async (resolve, reject) => {
    try {
      apiURL.forEach(async (element) => {
        getData = () => {
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await axios.get(eodURL(element.name,element.type,element.url));
              console.log(data,"try");
              resolve(data);
            } catch (err) {
              // const indexOfKey = eodApiKey.indexOf(element.url) + 1;
              // element.url = eodApiKey[indexOfKey]
              eodApiKeyArray.shift();
              console.log(err);
              reject(err);
            }
          });
        };
        const data = await getData();
        // const { data } = await axios.get(
        //   eodURL(element.name, element.type, element.url)
        // );
        let { code, close } = data;
        if (element.type === commodityAbbr){
          close = close/31.1
        }
        code = code.slice(0, code.lastIndexOf("."));

        const alreadyInsertedData = await graphqlOperation(
          { Limit: 10000 },
          "ListEodPricess"
        );
        const insertedData =
          (await alreadyInsertedData.body.data.listEODPricess.items.some(
            (result) => result.id === code
          ))
            ? await graphqlOperation(
                { id: code, price: close, name: code },
                "UpdateEodPrices"
              )
            : await graphqlOperation(
                { id: code, price: close, name: code },
                "CreateEodPrices"
              );

        console.log("Operation result:", insertedData);
        resolve(insertedData);
      });
    } catch {
      console.log(err);
      reject(err);
    }
  });
};

exports.handler = async (event) => {
  let data = await eodCurrenciesPrice();
  return await data;
};
