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

const pushData = async (data) => {
  const alreadyInsertedData = await graphqlOperation(
    { Limit: 10000 },
    "ListEodPricess"
  );
  const updatedList = [];
  for (i in data) {
    const insertedData =
      (await alreadyInsertedData.body.data.listEODPricess.items.some(
        (result) => result.id === data[i].code
      ))
        ? await graphqlOperation(
            {
              id: data[i].code,
              price: data[i].close,
              name: data[i].code,
            },
            "UpdateEodPrices"
          )
        : await graphqlOperation(
            {
              id: data[i].code,
              price: data[i].close,
              name: data[i].code,
            },
            "CreateEodPrices"
          );
    console.log(insertedData.body);
    updatedList.push(insertedData.body);
  }
  return updatedList;
};

module.exports = {
  getData,
  pushData,
};
