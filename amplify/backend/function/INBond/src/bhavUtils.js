const fs = require("fs");
const csv = require("csv-parser");
const { tempDir } = require("/opt/nodejs/utility");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { calcSchema } = require("./calculate");

const extractDataFromCSV = async (
  fileName,
  typeExchg,
  codes,
  schema,
  isinMap,
  table
) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    const stream = fs
      .createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", async (record) => {
        if (isinMap[record[codes.id]]) return;
        let updateSchema;
        try {
          stream.pause();
          updateSchema = await calcSchema(
            record,
            codes,
            schema,
            typeExchg,
            isinMap,
            table
          );
        } finally {
          stream.resume();
        }
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
				console.log(batchRecords.length);
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
