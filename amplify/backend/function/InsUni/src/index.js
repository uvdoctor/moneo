const { getFundamentalData } = require("/opt/nodejs/eod");
const {
  pushData,
  getTableNameFromInitialWord,
  getDataFromTable,
  appendGenericFields,
} = require("/opt/nodejs/insertIntoDB");
const table = "InsUni";

const getAndPushData = (data, tableName) => {
  return new Promise(async (resolve, reject) => {
    const insuniTableData = await getDataFromTable(tableName);
    let batches = [];
    let batchRecords = [];
    let count = 0;
    for (let record of data) {
      try {
        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
          const newRecords = record.dynamodb.NewImage.ins.L;
          for (let item of newRecords) {
            const id = item.M.id.S;
            const sid = item.M.sid.S;
            const exchg = item.M.exchg.S;
            const curr = item.M.curr.S;
            const idAlreadyExists = insuniTableData.Items.some(
              (item) => item.id === id
            );
            if (!idAlreadyExists) {
              const fundamentalData = await getFundamentalData(sid, exchg);
              console.log(fundamentalData);
              let schema = {
                id: id,
                sid: sid,
                curr: curr,
                fun: fundamentalData,
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
        }
      } catch (err) {
        reject(err);
      }
    }
    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
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