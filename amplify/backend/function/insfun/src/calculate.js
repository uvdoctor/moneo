const { appendGenericFields } = require("/opt/nodejs/insertIntoDB");
const calculateSchema = (data, isinMap, exchg, table) => {
  let count = 0;
  let batches = [];
  let batchRecords = [];
  for (let index = 0; index < 500; index++) {
    const exchgData = data[index];
    if (exchgData) {
      const id = exchgData.General.ISIN;
      const sid = exchgData.General.Code;
      if (isinMap[sid] || isinMap[id]) continue;
      isinMap[sid] = sid;
      isinMap[id] = id;
      let schema = {
        id: sid,
        isin: id,
        exchg: exchg,
        ana: data[index]
      };
      appendGenericFields(schema, table);
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

module.exports = { calculateSchema }