const {
  pushData,
  getTableNameFromInitialWord,
  appendGenericFields,
} = require("/opt/nodejs/insertIntoDB");
const table = "InsUserMap";

const getAndPushData = (data, tableName) => {
  return new Promise(async (resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    for (let record of data) {
      try {
        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
          const uname = record.dynamodb.Keys.uname.S;
          const newRecords = record.dynamodb.NewImage.ins.L;
          for (let item of newRecords) {
            const id = item.M.id.S;
            const sid = item.M.sid ? item.M.sid.S : null;
            const type = item.M.type ? item.M.type.S : null;
            const subt = item.M.subt ? item.M.subt.S : null;
            let schema = {
              id: id,
              sid: sid,
              type: type,
              subt: subt,
              user: uname,
            };
            schema = appendGenericFields(schema, table);
            console.log(schema);
            batches.push({ PutRequest: { Item: schema } });
            count++;
            if (count === 25) {
              batchRecords.push(batches);
              batches = [];
              count = 0;
            }
          }
        }
        if (record.eventName === "REMOVE") {
          const uname = record.dynamodb.Keys.uname.S;
          const oldRecords = record.dynamodb.OldImage.ins.L;
          for (let item of oldRecords) {
            const id = item.M.id.S;
            const schema = {
              id: id,
              user: uname,
            };
            batches.push({ DeleteRequest: { Key: schema } });
            count++;
            if (count === 25) {
              batchRecords.push(batches);
              batches = [];
              count = 0;
            }
          }
        }
      } catch (err) {
        reject(err);
      }
    }
    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    console.log(batchRecords);
    for (let batch in batchRecords) {
      const results = await pushData(batchRecords[batch], tableName);
      console.log(results);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  const tableName = await getTableNameFromInitialWord(table);
  return await getAndPushData(event.Records, tableName);
};