const fs = require("fs");
const fsPromise = require("fs/promises");
const { pushData, pushDataForFeed, getTableNameFromInitialWord } = require("/opt/nodejs/databaseUtils");
const { downloadZip, unzipDownloads, cleanDirectory } = require("/opt/nodejs/downloadUtils");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const { getPrev } = require("/opt/nodejs/prevUtils");
// const { pushData, pushDataForFeed, getTableNameFromInitialWord } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const { downloadZip, unzipDownloads, cleanDirectory } = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
// const { tempDir, zipFile } = require("../../moneoutilslayer/lib/nodejs/utility");
// const { getPrev } = require("../../moneoutilslayer/lib/nodejs/prevUtils");
const getDataFromTxtFile = require("./bhavUtils");
const constructedApiArray = require("./utils");
const { mkdir } = fsPromise;
const table = "NPSPrice";

const downloadFile = async (apiArray, prevMap, isPrevFile) => {
  const { fileName, url } = apiArray;
  await mkdir(tempDir);
  await downloadZip(url, tempDir, zipFile);
  await unzipDownloads(zipFile, tempDir);
  return await getDataFromTxtFile(fileName, table, prevMap, isPrevFile);
};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const apiArray = constructedApiArray(diff);
    try {
      if (fs.existsSync(tempDir)) {
        await cleanDirectory(tempDir, "Initial cleaning completed");
      }
      const prevMap = await getPrev(diff, downloadFile, constructedApiArray, table)
			console.log("Previous Price Map", Object.keys(prevMap).length);
      const data = await downloadFile(apiArray, prevMap, false);
      for (let batch in data) {
        await pushData(data[batch], tableName);
      }
      await pushDataForFeed(table, data, "", apiArray.url);
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

module.exports = { getAndPushData  }