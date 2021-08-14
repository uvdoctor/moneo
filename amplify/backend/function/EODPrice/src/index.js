const graphqlOperation = require("./operation");
const eodApiKey = process.env.EOD_API_KEY;
const axios = require("axios");
const eodHistoricalDataUrl = `https://eodhistoricaldata.com/api/real-time/EUR.FOREX?api_token=${eodApiKey}&order=d&fmt=json`;
exports.handler = async (event) => {
  const { data } = await axios.get(eodHistoricalDataUrl);
  const { code, close } = data;
  
  const alreadyInsertedData = await (graphqlOperation({Limit:10000},'ListEodPrices','ListEodPricess'));
  const insertedData =alreadyInsertedData.body.data.listEODPricess.items.some((result)=> result.id === code)
    ? await graphqlOperation({input: {id: code,price: close,name: code,}}, "UpdateEodPrices","UpdateEodPrices")
    : await graphqlOperation({input: {id: code,price: close,name: code,}}, "CreateEodPrices","CreateEodPrices");

  
  console.log("Operation result:", insertedData)
  return insertedData;
};
