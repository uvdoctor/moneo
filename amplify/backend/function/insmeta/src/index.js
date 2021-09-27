const table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const { pushData } = require("/opt/nodejs/insertIntoDB");
const { pushDataForFeed } = require("/opt/nodejs/utility");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("opt/nodejs/bhavUtils");
const { tempDir, zipFile, apiArray } = require("./utils");
const extractDataFromExcel = require("./bhavUtils");
const isinMap = {};

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { fileName, url, exchg } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromExcel(
          cleanDirectory,
          tempDir,
          fileName,
          table,
          isinMap
        );
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, pushData, exchg, url, exchg);
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
