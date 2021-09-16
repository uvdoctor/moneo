const axios = require("axios");
const docClient = require("/opt/nodejs/insertIntoDB");

const getData = async (url, mcap, indices, isinMap, table) => {
  const schema = {};
  let batches = [];
  let count = 0;
  let batchRecords = [];
  let response;
  try {
    response = await axios.get(url);
  } catch (err) {
    const { status } = err.response;
    console.log(status);
    return;
  }

  response.data.data.map((item, index) => {
    if (index === 0 && mcap) return;
    if (isinMap[item.meta.isin]) return;
    schema.id = item.meta.isin;
    schema.name = item.meta.companyName;
    schema.mcap = mcap;
    schema.ychg = item.perChange365d;
    schema.mchg = item.perChange30d;
    if (!mcap) {
      schema.yhigh = Math.round(item.wkhi * 100) / 100;
      schema.ylow = Math.round(item.wklo * 100) / 100;
      schema.ind = item.meta.industry;
      if (indices === "ETF") schema.index = item.assets;
    } else {
      schema.ind = item.meta.industry;
      schema.yhigh = Math.round(item.yearHigh * 100) / 100;
      schema.ylow = Math.round(item.yearLow * 100) / 100;
      schema.index = indices;
    }
    schema.__typename = table.slice(0, table.indexOf("-"));
    schema.createdAt = new Date().toISOString();
    schema.updatedAt = new Date().toISOString();
    isinMap[item.meta.isin] = item.meta.isin;
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
