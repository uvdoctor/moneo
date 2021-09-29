const fs = require("fs");
const fsPromise = require("fs/promises");
const { pushData, pushDataForFeed } = require("/opt/nodejs/insertIntoDB");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("/opt/nodejs/bhavUtils");
const constructedApiArray = require("./utils");
const extractDataFromCSV = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "INBond-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
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
        const csvFile = `${tempDir}/${fileName}`;
        await mkdir(tempDir);
        if (url.includes("zip")) {
          await downloadZip(url, tempDir, zipFile);
          await unzipDownloads(zipFile, tempDir);
        } else {
          await downloadZip(url, tempDir, csvFile);
        }
        const data = await extractDataFromCSV(
          fileName,
          typeExchg,
          codes,
          schema,
          isinMap,
          table
        );
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, i + 1, url, typeExchg);
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
