const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("/opt/nodejs/bhavUtils");
const {
  getDataFromTable,
  pushData,
  pushDataForFeed,
} = require("/opt/nodejs/insertIntoDB");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const constructedApiArray = require("./utils");
const { extractDataFromCSV, addMetaData } = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "INExchg-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const isinMap = {};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const apiArray = constructedApiArray(diff);
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { typeExchg, fileName, url, schema, codes } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const exchgData = await extractDataFromCSV(
          fileName,
          typeExchg,
          codes,
          schema,
          table,
          isinMap
        );
        const data = await addMetaData(exchgData, getDataFromTable);
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, typeExchg, url, typeExchg);
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
