const fs = require("fs");
const fsPromise = require("fs/promises");
const { pushData, pushDataForFeed } = require("/opt/nodejs/insertIntoDB");
const {
  downloadZip,
  unzipDownloads,
  cleanDirectory,
} = require("/opt/nodejs/bhavUtils");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const calc = require("./calculate");
const getDataFromTxtFile = require("./bhavUtils");
const constructedApiArray = require("./utils");
const { mkdir } = fsPromise;
const table = "NPS-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const apiArray = constructedApiArray(diff);
    try {
      if (fs.existsSync(tempDir)) {
        await cleanDirectory(tempDir, "Initial cleaning completed");
      }
      const { fileName, url } = apiArray;
      await mkdir(tempDir);
      await downloadZip(url, tempDir, zipFile);
      await unzipDownloads(zipFile, tempDir);
      const data = await getDataFromTxtFile(fileName, calc, table);
      for (let batch in data) {
        await pushData(data[batch], table);
      }
      await pushDataForFeed(table, data, fileName, url);
    } catch (err) {
      reject(err);
    }

    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
