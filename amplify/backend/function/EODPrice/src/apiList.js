const cryptoAbbr = "CC";
const currencyAbbr = "FOREX";
const commodityAbbr = "COMM";

const apiToCall = [
  // {
  //   name: "BTC-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "LTC-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "ETH-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "XRP-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "DASH-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "XMR-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "ETC-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "BCH-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "DOGE-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "XLM-USD",
  //   type: cryptoAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "EUR",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "INR",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "AUD",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "CAD",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "JPY",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "CNY",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "CHF",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "GBP",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "SEK",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
  // {
  //   name: "NZD",
  //   type: currencyAbbr,
  //   fieldName: "close",
  // },
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

module.exports = {commodityAbbr,cryptoAbbr,currencyAbbr,apiToCall};
