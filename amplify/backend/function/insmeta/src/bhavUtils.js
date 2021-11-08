const fs = require("fs");
const csv = require("csv-parser");
const { tempDir } = require("/opt/nodejs/utility");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { appendGenericFields } = require('/opt/nodejs/insertIntoDB');
const calcInd = require("./calculate");

const extractData = async (fileName, codes, isinMap, table) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (isinMap[record[codes.id]]) return;
        const schema = {
          ind: calcInd(record[codes.ind].trim()),
          id: record[codes.id],
        };
        appendGenericFields(schema, table)
        if (
          fileName === "ind_nifty100list.csv" ||
          fileName === "ind_niftymidcap150list.csv"
        )
          schema.mcap = codes.mcap;

        batches.push({ PutRequest: { Item: schema } });
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
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve(batchRecords);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${fileName} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

module.exports = extractData;
