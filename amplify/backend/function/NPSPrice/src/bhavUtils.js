const fs = require("fs");
const split = require("split");
const { tempDir } = require("/opt/nodejs/utility");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { appendGenericFields } = require('/opt/nodejs/insertIntoDB');
const calc = require('./calculate');

const getDataFromTxtFile = async (fileName, table) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(split())
      .on("data", (record) => {
        const data = record.split(",");
        const id = data[3];
        const name = data[4];
        const nav = data[5];
        if (!id) return;
        let schema = {
          id: id,
          pfm: calc.calcPFM(name),
          st: calc.calcST(name),
          name: name,
          type: calc.calcType(name),
          subt: calc.calcSubType(name),
          price: nav,
        };
        schema.risk = calc.calcRisk(schema.subt);
        schema = appendGenericFields(schema, table)
        batches.push({ PutRequest: { Item: schema } });
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
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve(batchRecords);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${fileName} txt file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

module.exports = getDataFromTxtFile;
