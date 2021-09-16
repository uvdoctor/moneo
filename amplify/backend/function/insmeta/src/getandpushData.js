const axios = require("axios");
const docClient = require("/opt/nodejs/insertIntoDB");

const getData = async (url, mcap, indices, isinMap, table) => {
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
        console.log(status);
        urlCount++;
        return await res(urlCount);
      }
    }
  };

  const response = await res(urlCount);
  if (!response) return "Url is not accessible";

  response.data.data.map((item, index) => {
    if (index === 0) return;
    if (isinMap[item.meta.isin]) return;
    schema.id = item.meta.isin;
    schema.name = item.meta.companyName;
    schema.mcap = mcap;
    schema.ychg = item.perChange365d;
    schema.mchg = item.perChange30d;
    schema.ind = item.meta.industry;
    if (!mcap) {
      schema.yhigh = Math.round(item.wkhi * 100) / 100;
      schema.ylow = Math.round(item.wklo * 100) / 100;
      schema.index = "All exchange traded fund";
      schema.under = item.assets;
    } else {
      schema.yhigh = Math.round(item.yearHigh * 100) / 100;
      schema.ylow = Math.round(item.yearLow * 100) / 100;
      schema.index = indices;
    }
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
