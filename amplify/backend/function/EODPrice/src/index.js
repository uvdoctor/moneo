const graphqlOperation = require("./operation");
const eodApiKey = process.env.EOD_API_KEY;
const axios = require("axios");
const eodHistoricalDataUrl = `https://eodhistoricaldata.com/api/real-time/EUR.FOREX?api_token=${eodApiKey}&order=d&fmt=json`;
exports.handler = async (inputData) => {
  const { data } = await axios.get(eodHistoricalDataUrl);
  const { code, close } = data;
  const insertedData = await graphqlOperation(
    {
      input: {
        id: code,
        price: close,
        name: code,
      },
    },
    "UpdateEodPrices"
  );
  console.log("Operation result:", insertedData)
  return insertedData;
};
