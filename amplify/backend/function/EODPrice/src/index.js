const graphqlOperation = require("./operation");
const eodApiKey = process.env.EOD_API_KEY;
// const eodAPi = ()=>{for (i of api){[1,2,3,4,5,6,7,8,9,10]}}
const axios = require("axios");
const eodCurrenciesURL = (index) =>
  `https://eodhistoricaldata.com/api/real-time/${index}.FOREX?api_token=${eodApiKey}&order=d&fmt=json`;
const eodCommodityURL = (index) =>
  `https://eodhistoricaldata.com/api/real-time/${index}.COMM?api_token=${eodApiKey}&order=d&fmt=json&from=2017-08-01.`;
const apiURL = [
  {
    key: "EUR",
    url: eodCurrenciesURL("EUR"),
  },
  {
    key: "INR",
    url: eodCurrenciesURL("INR"),
  },
  {
    key: "AUD",
    url: eodCurrenciesURL("AUD"),
  },
  {
    key: "CAD",
    url: eodCurrenciesURL("CAD"),
  },
  // {
  //   key: "GOLD",
  //   url: eodCommodityURL("GC"),
  // },
  // {
  //   key: "Platinum",
  //   url: eodCommodityURL("PL"),
  // },
  // {
  //   key: "SILVER",
  //   url: eodCommodityURL("SI"),
  // },
  // {
  //   key: "Palladium",
  //   url: eodCommodityURL("PA"),
  // },
];

eodCurrenciesPrice = () => {
  return new Promise(async (resolve, reject) => {
    try {
      apiURL.forEach(async (element) => {
        const { data } = await axios.get(element.url);
        let { code, close } = data;
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
