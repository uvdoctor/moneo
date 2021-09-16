const axios = require("axios");
const docClient = require("/opt/nodejs/insertIntoDB");
const getData = async (url, mcap, indices, isinMap, table, batchRecords) => {
  const schema = {};
  let batches = [];
  let count = 0;
  const response = await axios.get(url);
  response.data.data.map((item, index) => {
    if (index === 0) return;
    if (isinMap[item.meta.isin]) return;
    schema.id = item.meta.isin;
    schema.name = item.meta.companyName;
    schema.mcap = mcap;
    schema.yhigh = item.yearHigh;
    schema.ylow = item.yearLow;
    schema.ychg = item.perChange365d;
    schema.mchg = item.perChange30d;
    schema.ind = item.meta.industry;
    schema.index = indices;
    schema.__typename = table.slice(0, table.indexOf("-"));
    schema.createdAt = new Date().toISOString();
    schema.updatedAt = new Date().toISOString();
    isinMap[item.meta.isin] = item.meta.isin;
    batches.push({ PutRequest: { Item: schema } });
    count++;
    if (count === 25) {
      batchRecords.push(batches);
      batches = [];
      count = 0;
    }
  });
  if (count < 25) {
    batchRecords.push(batches);
  }

  return batchRecords;
};

const pushData = async (data, table, index) => {
  return new Promise(async (resolve, reject) => {
    var params = {
      RequestItems: {
        [table]: data,
      },
    };
    try {
      const updateRecord = await docClient.batchWrite(params).promise();
      console.log(updateRecord);
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
