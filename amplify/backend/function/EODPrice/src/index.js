const insertInstrument = require("./operation");
const eodApiKey = process.env.EOD_API_KEY;
const axios = require("axios");
const eodHistoricalDataUrl = `https://eodhistoricaldata.com/api/real-time/EUR.FOREX?api_token=${eodApiKey}&order=d&fmt=json`;
exports.handler = async (inputData) => {
  const { data } = await axios.get(eodHistoricalDataUrl);
  const { code, close } = data;
  const insertedData = await insertInstrument(
    {
      input: {
        id: code,
        price: close,
        name: code,
      },
    },
    "UpdateEodPrices"
  );
  insertedData?.body?.errors
    ? console.log(insertedData?.body?.errors)
    : insertedData?.body?.data.createEODPrices;
  return insertedData;
};
