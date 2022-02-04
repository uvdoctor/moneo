const {
  pushData,
  getTableNameFromInitialWord,
  appendGenericFields,
} = require("/opt/nodejs/insertIntoDB");
const table = "InsUni";

const getAndPushData = (data, tableName) => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    for (record of data) {
      try {
        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
          record.dynamodb.NewImage.ins.L.map((item) => {
            const schema = appendGenericFields({ id: item.M.id.S }, table);
            batches.push({ PutRequest: { Item: schema } });
            count++;
            if (count === 25) {
              batchRecords.push(batches);
              batches = [];
              count = 0;
            }
          });
        }
        // if (record.eventName === "REMOVE") {
        //   // OldImage
        // }
      } catch (err) {
        reject(err);
      }
    }
    console.log(batches, batchRecords);
    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    const result = await pushData(data, tableName);
    console.log(result);
    resolve();
  });
};

exports.handler = async (event) => {
  const tableName = await getTableNameFromInitialWord(table);
  return await getAndPushData(event.Records, tableName);
};
