const fs = require("fs");
const csv = require("csv-parser");
const { tempDir } = require("/opt/nodejs/utility");
const { cleanDirectory } = require("/opt/nodejs/downloadUtils");
const { calcSchema, calculatePrice } = require("./calculate");

const extractDataFromCSV = async (
  fileName,
  typeExchg,
  codes,
  schema,
  isinMap,
  table,
  prevMap,
  isPrevFile,
  prevBatch
) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        const price = calculatePrice(record[codes.price], record[codes.fv]);
        const id = record[codes.id];
        if (!id || ["MC", "MF", "US"].includes(record[codes.subt]) || !price) return;
        if (isPrevFile) {
          prevMap[record[codes.id]] = price;
          return;
        }
        if (isinMap[id]) return;
        const updateSchema = calcSchema(
          record,
          codes,
          schema,
          typeExchg,
          isinMap,
          table,
          prevMap,
          prevBatch,
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
        if (count < 25 && count > 0) {
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
          `Unable to read ${typeExchg} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

module.exports = extractDataFromCSV;
