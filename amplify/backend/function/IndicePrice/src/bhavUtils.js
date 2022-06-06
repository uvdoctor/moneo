const csv = require("csv-parser");
const fs = require("fs");
const { cleanDirectory } = require("/opt/nodejs/downloadUtils");
const { tempDir } = require("/opt/nodejs/utility");
// const { cleanDirectory } = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
// const { tempDir } = require("../../moneoutilslayer/lib/nodejs/utility");

const extractDataFromCSV = async (fileName) => {
  const end = new Promise((resolve, reject) => {
    const dataFromNse = [];
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        dataFromNse.push(record);
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve(dataFromNse);
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

module.exports = extractDataFromCSV;
