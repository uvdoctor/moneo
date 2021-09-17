const axios = require("axios");
const docClient = require("/opt/nodejs/insertIntoDB");

const calcType = (type) => {
  if (type === "BROAD MARKET INDICES") return "E";
  if (type === "SECTORAL INDICES") return "E";
  if (type === "STRATEGY INDICES") return "E";
  if (type === "THEMATIC INDICES") return "E";
  if (type === "FIXED INCOME INDICES") return "F";
};

const getData = async (url, table) => {
  const schema = {};
  let batches = [];
  let count = 0;
  let batchRecords = [];
  let response;
  try {
    response = await axios.get(url, { timeout: 3000 });
  } catch (err) {
    const { status } = err.response;
    console.log(status);
    return;
  }
  response.data.data.map((item) => {
    schema.id = item.indexName;
    schema.name = item.indexName;
    schema.price = item.last;
    schema.yhigh = Math.round(item.yearHigh * 100) / 100;
    schema.ylow = Math.round(item.yearLow * 100) / 100;
    // schema.ychg = item.perChange365d;
    // schema.mchg = item.perChange30d;
    // schema.type = calcType(item.key);
    schema.curr = "INR";
    schema.__typename = table.slice(0, table.indexOf("-"));
    schema.createdAt = new Date().toISOString();
    schema.updatedAt = new Date().toISOString();

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
