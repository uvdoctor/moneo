const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("/opt/nodejs/downloadUtils");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
  getDataFromTable
} = require("/opt/nodejs/databaseUtils");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const { getEODdata, getSplitInfo, getDividendInfo } = require("/opt/nodejs/eod");
const constructedApiArray = require("./utils");
const {
  extractPartOfData,
  extractDataFromCSV,
  mergeEodAndExchgData,
} = require("./bhavUtils");
const { mkdir } = fsPromise;
const exchgTable = "INExchgPrice";
const bondTable = "INBondPrice";
const isinMap = {};
const dataToPushInFeeds = [];

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const exchgTableName = await getTableNameFromInitialWord(exchgTable);
    const bondTableName = await getTableNameFromInitialWord(bondTable);
    console.log("Table name fetched: ", exchgTableName, bondTableName);
    const { apiArray, partOfDataApiArray } = constructedApiArray(diff);
    const nameMap = {};
    const weekHLMap = {};
    const mcaptMap = {}
    try {
      if (fs.existsSync(tempDir)) {
        await cleanDirectory(tempDir, "Initial cleaning completed");
      }
      for (let ind = 0; ind < partOfDataApiArray.length; ind++) {
        const { exchg, id, fileName, url, codes } = partOfDataApiArray[ind];
        const csvFile = `${tempDir}/${fileName}`;
        await mkdir(tempDir);
        await downloadZip(url, tempDir, csvFile);
        const dataCount = await extractPartOfData(
          fileName,
          codes,
          nameMap,
          weekHLMap,
          mcaptMap
        );
        dataToPushInFeeds.push({
          table: exchgTable,
          dataCount,
          identifier: `${id}${ind + 1}`,
          url,
          exchg,
        });
      }
      for (let i = 0; i < apiArray.length; i++) {
        const { exchg, fileName, url, schema, codes } = apiArray[i];
        console.log(url);
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const { exchgData, bondData } = await extractDataFromCSV(
          fileName,
          exchg,
          codes,
          schema,
          exchgTable,
          isinMap,
          nameMap,
          weekHLMap,
          mcaptMap,
          bondTable,
        );
        let eodData;
        let splitData;
        let dividendData;
        try {
          eodData = await getEODdata(exchg);
          splitData = await getSplitInfo(exchg);
          dividendData = await getDividendInfo(exchg);
        } catch (error) {
          console.log(error);
        }
        const data = mergeEodAndExchgData(exchgData, eodData, splitData, dividendData);
        console.log(data.length);
        for (let batch in data) {
          await pushData(data[batch], exchgTableName);
        }
        for (let batch in bondData) {
          await pushData(bondData[batch], bondTableName);
        }
        dataToPushInFeeds.push({
          table: bondTable,
          dataCount: bondData,
          identifier: exchg,
          url,
          exchg,
        });
        dataToPushInFeeds.push({
          table: exchgTable,
          dataCount: data,
          identifier: exchg,
          url,
          exchg,
        });
      }
      for (let item of dataToPushInFeeds) {
        await pushDataForFeed(
          item.table,
          item.dataCount,
          item.identifier,
          item.url,
          item.exchg
        );
      }
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
