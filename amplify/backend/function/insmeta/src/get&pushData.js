const axios = require("axios");
const docClient = require("/opt/nodejs/insertIntoDB");

const getData = (url, mcap, indices, isinMap, table) => {
  const schema = {};
  let batches = [];
  let count = 0;
  let urlCount = 0;
  let batchRecords = [];
  const res = async (urlCount) => {
    try {
      const data = await axios.get(url);
      return data;
    } catch (err) {
      const { status } = err.response;
      if (status === 401 && urlCount < 5) {
        urlCount++;
        return await res(urlCount);
      }
    }
  };

  return new Promise(async (resolve, reject) => {
    const response = await res(urlCount);
    if (!response) reject("Url is not accessible");
    response.data.data.map((item, index) => {
      if (index === 0) return;
      if (isinMap[item.meta.isin]) return;
      schema.id = item.meta.isin;
      schema.name = item.meta.companyName;
      schema.mcap = mcap;
      schema.yhigh = Math.round(item.yearHigh * 100) / 100;
      schema.ylow = Math.round(item.yearLow * 100) / 100;
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
    resolve(batchRecords);
  });
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
