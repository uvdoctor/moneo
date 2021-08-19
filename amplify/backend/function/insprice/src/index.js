const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray } = utils;
const bhaoUtils = require("./bhavUtils");
const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
} = bhaoUtils;

const getData = () => {
  return new Promise(async (resolve, reject) => {
    let results = [];
    try {
      for (let i = 0; i < apiArray.length; i++) {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { type, fileName, url, codes } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromCSV(tempDir, fileName, type, codes);
        results = [...results, ...data];
      }
      resolve(results);
    } catch (err) {
      reject(err);
    }
  });
};

exports.handler = async (event) => {
  const data = await getData();
  return await pushData(data)
};

