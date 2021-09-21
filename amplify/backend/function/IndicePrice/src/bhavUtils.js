const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const csv = require("csv-parser");

const cleanDirectory = async (tempDir, msg) => {
  await rmdir(tempDir, { recursive: true });
  console.log(msg);
};

const downloadZip = (url, tempDir, file) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, async (res) => {
      const { statusCode } = res;
      if (statusCode < 200 || statusCode >= 300) {
        await cleanDirectory(
          tempDir,
          `Unable to download zip file, ${statusCode}`
        );
        return reject(new Error("statusCode=" + statusCode));
      }
      res.pipe(fs.createWriteStream(file));
      res.on("end", function () {
        resolve();
      });
    });
    req.on("error", async (e) => {
      await cleanDirectory(
        tempDir,
        `Unable to download zip file, ${e.message}`
      );
      reject(e.message);
    });
    req.end();
  });
};

const extractDataFromCSV = async (tempDir, fileName) => {
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

module.exports = {
  downloadZip,
  extractDataFromCSV,
  cleanDirectory,
};
