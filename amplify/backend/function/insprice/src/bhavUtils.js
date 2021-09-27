const fs = require("fs");
const csv = require("csv-parser");

const extractDataFromCSV = async (
  cleanDirectory,
  tempDir,
  fileName,
  typeExchg,
  codes,
  schema,
  calcSchema,
  table,
  isinMap
) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (isinMap[record[codes.id]]) return;
        const updateSchema = calcSchema(
          record,
          codes,
          schema,
          typeExchg,
          isinMap,
          table
        );
        if (!updateSchema) return;
        const dataToPush = JSON.parse(JSON.stringify(updateSchema));
        batches.push({ PutRequest: { Item: dataToPush } });

        count++;
        if (count === 25) {
          batchRecords.push(batches);
          batches = [];
          count = 0;
        }
      })
      .on("end", async () => {
        if (count < 25) {
          batchRecords.push(batches);
        }
        await cleanDirectory(
          tempDir,
          `${fileName} of ${typeExchg} results extracted successfully and directory is cleaned`
        );
        resolve(batchRecords);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${type} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

const addMetaData = async (exchgData, getAllData) => {
  const table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
  const data = await getAllData(table);
  exchgData.map((element) => {
    element.map((item) => {
      const metaData = data.Items.find(
        (re) => re.id === item.PutRequest.Item.id
      );
      if (!metaData) return;
      item.PutRequest.Item.meta = metaData;
    });
  });

  return exchgData;
};

module.exports = {
  extractDataFromCSV,
  addMetaData,
};
