const csv = require("csv-parser");
const fs = require("fs");

const extractDataFromCSV = async (tempDir, fileName, cleanDirectory) => {
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
