const axios = require("axios");
// const docClient = require("./insertIntoDB");
const docClient = require("/opt/nodejs/insertIntoDB"); 
const getData = async (url, table) => {
  let batches = [];
  let count = 0;
  let batchRecords = [];
  
  try {
    const {data} = await axios.get(url);
    data.data.map((item) => {
      const { indexName, last, yearHigh, yearLow } = item
      const schema = {
        id: indexName,
        name: indexName,
        price: last,
        yhigh: Math.round(yearHigh * 100) / 100,
        ylow: Math.round(yearLow * 100) / 100,
        curr: "INR",
        __typename : table.slice(0, table.indexOf("-")),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const dataToPush = JSON.parse(JSON.stringify(schema));
      batches.push({ PutRequest: { Item: dataToPush } });
      count++;
      if (count === 25) {
        batchRecords.push(batches);
        batches = [];
        count = 0;
      }
    });

    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    return batchRecords;
  } catch(err) {
    throw new Error(err.toString())
  }
};

const pushData = async (data, table, index) => {
  return new Promise( async (resolve, reject) => {
    var params = {
      RequestItems: {
        [table]: data,
      },
    };
    try {
      const updateRecord = await docClient.batchWrite(params).promise();
      resolve(updateRecord);
    } catch (error) {
      reject(`Error in dynamoDB: ${JSON.stringify(error)}, ${index}`);
    }
  });
};

module.exports = {
  getData,
  pushData,
};
