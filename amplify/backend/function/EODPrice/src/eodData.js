const graphqlOperation = require("./operation");
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

const executeMutation = async (mutation, input) => {
  return await graphqlOperation({ input: input }, mutation);
};

const pushData = (data) => {
  let instrumentData = { updatedIDs: [], errorIDs: [] };
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < data.length; i++) {
      const dataToInsert = {
        id: data[i].code,
        price: data[i].close,
        name: data[i].code,
      };
      try {
        const updatedData = await executeMutation(
          "UpdateEodPrices",
          dataToInsert
        );
        if (!updatedData.body.data.updateEODPrices) {
          await executeMutation("CreateEodPrices", dataToInsert);
        }
        insertedData.body.errors
          ? instrumentData.errorIDs.push({
              id: data[i].id,
              error: insertedData.body.errors,
            })
          : instrumentData.updatedIDs.push(data[i]);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(instrumentData);
    resolve(instrumentData);
  });
};

module.exports = {
  getData,
  pushData,
};
