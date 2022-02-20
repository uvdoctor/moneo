const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/insertIntoDB");
const { getFundamentalDataByLimit } = require("/opt/nodejs/eod");
const table = "INExchgFun";
const isinMap = {};

const organizeData = (data, isinMap, exchg) => {
  let count = 0;
  let batches = [];
  let batchRecords = [];
  for (let index = 0; index < 500; index++) {
    const exchgData = data[index];
    if (exchgData) {
      const id = exchgData.General.ISIN;
      if (isinMap[id]) return;
      const sid = exchgData.General.Code;
      isinMap[id] = id;
      const schema = {
        id: id,
        sid: sid,
        exchg: exchg,
        ana: data[index],
      };
      batches.push({ PutRequest: { Item: schema } });
      count++;
      if (count === 25) {
        batchRecords.push(batches);
        batches = [];
        count = 0;
      }
    }
  }
  if (count < 25 && count > 0) {
    batchRecords.push(batches);
  }
  return batchRecords;
};

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const exchgList = ["BSE", "NSE"];
    const offset = [ 0, 500, 1000, 1500 ];
    try {
      for (let exchg of exchgList) {
        for (let i = 0; i < offset.length; i++) {
          const { data, url } = await getFundamentalDataByLimit(
            exchg,
            offset[i]
          );
          console.log("data", data, url);
          const batches = organizeData(data, isinMap, exchg);
          console.log(batches);
          for (let batch in batches) {
            const result = await pushData(batches[batch], tableName);
            console.log(result);
          }
          await pushDataForFeed(table, batches, exchg, url, exchg);
        }
      }
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
