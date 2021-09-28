const fs = require("fs");
const fsPromise = require("fs/promises");
const { pushData, pushDataForFeed } = require("/opt/nodejs/insertIntoDB");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("/opt/nodejs/bhavUtils");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const constructedApiArray = require("./utils");
const extractDataFromExcel = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const isinMap = {};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const apiArray = constructedApiArray(diff);
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { fileName, url, exchg } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromExcel(fileName, table, isinMap);
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, i + 1, url, exchg);
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
