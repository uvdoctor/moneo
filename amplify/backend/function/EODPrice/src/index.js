const graphqlOperation = require("./operation");
const axios = require("axios");
const eodApiKey = process.env.EOD_API_KEY;
const cryptoAbbr = "CC";
const currencyAbbr = "FOREX";
const commodityAbbr = "COMM";

const apiKeys = {
  eodhistoricaldata: eodApiKey.split(","),
};

const eodURL = (name, type) =>
`https://eodhistoricaldata.com/api/real-time/${name}.${type}?api_token=${apiKeys.eodhistoricaldata[0]}&fmt=json`;;

const apiToCall = [
  // fieldName: "close",
  {
    name: "BTC-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "LTC-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "ETH-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "XRP-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "DASH-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "XMR-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "ETC-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "BCH-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "DOGE-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "XLM-USD",
    type: cryptoAbbr,
    
  },
  {
    name: "EUR",
    type: currencyAbbr,
    
  },
  {
    name: "INR",
    type: currencyAbbr,
    
  },
  {
    name: "AUD",
    type: currencyAbbr,
    
  },
  {
    name: "CAD",
    type: currencyAbbr,
    
  },
  {
    name: "JPY",
    type: currencyAbbr,
    
  },
  {
    name: "CNY",
    type: currencyAbbr,
    
  },
  {
    name: "CHF",
    type: currencyAbbr,
    
  },
  {
    name: "GBP",
    type: currencyAbbr,
    
  },
  {
    name: "SEK",
    type: currencyAbbr,
    
  },
  {
    name: "NZD",
    type: currencyAbbr,
    
  },
  {
    name: "GC",
    type: commodityAbbr,
    
  },
  {
    name: "PL",
    type: commodityAbbr,
    
  },
  {
    name: "SI",
    type: commodityAbbr,
    
  },
  {
    name: "PA",
    type: commodityAbbr,
    
  },
];


const getData = async (element) => {
  try {
    const { data } = await axios.get(eodURL(element.name,element.type));
    return data;
  } catch (err) {
    apiKeys.eodhistoricaldata.shift();
    return await getData(element);
  }
};

const eodPrice = () => {
  return new Promise(async (resolve, reject) => {
    apiToCall.forEach(async (element) => {
      console.log(element.type);
      const result = await getData(element);
      console.log(result);
      let { code, close } = result;
      if (element.type === commodityAbbr) {
        close = close / 31.1;
        code = code.slice(0, code.lastIndexOf(".")) }
      else if(element.type === cryptoAbbr){
        code = code.slice(0, code.lastIndexOf("-"));
      }
      else {
        code = code.slice(0, code.lastIndexOf("."));
      }
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
  });
};
exports.handler = async (event) => {
  let data = await eodPrice();
  console.log(data);
  return data;
};
