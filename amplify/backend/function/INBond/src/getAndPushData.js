const fs = require("fs");
const fsPromise = require("fs/promises");
const constructedApiArray = require("./utils");
const extractDataFromCSV = require("./bhavUtils");
const { mkdir } = fsPromise;
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
  tempDir,
  zipFile,
} = require("../../moneoutilslayer/lib/nodejs/utility");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
const {
  getPrev,
  updatePrevByGetItem,
} = require("../../moneoutilslayer/lib/nodejs/prevUtils");
const isinMap = {};
const prevBatch = {};
const table = "INBondPrice";

const downloadFile = async (apiArray, prevMap, isPrevFile, prevBatch) => {
  const { typeExchg, fileName, url, schema, codes } = apiArray;
  const csvFile = `${tempDir}/${fileName}`;
  await mkdir(tempDir);
  if (url.includes("zip")) {
    await downloadZip(url, tempDir, zipFile);
    await unzipDownloads(zipFile, tempDir);
  } else {
    await downloadZip(url, tempDir, csvFile);
  }
  return await extractDataFromCSV(
    fileName,
    typeExchg,
    codes,
    schema,
    isinMap,
    table,
    prevMap,
    isPrevFile,
    prevBatch
  );
};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const apiArray = constructedApiArray(diff);
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const prevMap = await getPrev(
          diff,
          downloadFile,
          constructedApiArray,
          table,
          i
        );
        console.log("Prev map", Object.keys(prevMap).length);
        const { url, typeExchg } = apiArray[i];
        const data = await downloadFile(apiArray[i], prevMap, false, prevBatch);
        for (let batch in data) {
          await pushData(data[batch], tableName);
        }
        await pushDataForFeed(table, data, `${typeExchg}${i}`, url, typeExchg);
      } catch (err) {
        reject(err);
      }
    }
    console.log("Prev Batch", Object.keys(prevBatch).length);
    if (!diff) {
      await updatePrevByGetItem(prevBatch, tableName);
    }
    resolve(1);
  });
};

module.exports = { getAndPushData, downloadFile };
