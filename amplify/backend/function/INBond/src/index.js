const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const {getAllData, pushData} = require("/opt/nodejs/insertIntoDB");
const utility = require("/opt/nodejs/utility");
const utils = require("./utils");
const { tempDir, zipFile, apiArray, getFileName, getUrl } = utils;
const bhaoUtils = require("./bhavUtils");
const { calcSchema, calc, calcYTM } = require("./calculate");
const { downloadZip, unzipDownloads, extractDataFromCSV, cleanDirectory } =
  bhaoUtils;
const table = "INBond-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const isinMap = {};
const numToDeductFromDate = (num) => num;

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const num = numToDeductFromDate(diff);
        const { date, month, monthChar, year, yearFull } = utility(num);
        const dateFormat = `${date}${month}${yearFull}`;
        const { typeExchg, file, url, schema, codes } = apiArray[i];
        const fileName = getFileName(file, dateFormat, typeExchg);
        const urlName = getUrl(url, monthChar, yearFull, fileName, dateFormat);
        const csvFile = `${tempDir}/wdmlist_${date}${month}${yearFull}`;
        await mkdir(tempDir);
        if (urlName.includes("zip")) {
          await downloadZip(urlName, tempDir, zipFile);
          await unzipDownloads(zipFile, tempDir);
        }
        await downloadZip(urlName, tempDir, csvFile);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          typeExchg,
          codes,
          schema,
          calcSchema,
          isinMap,
          table
        );
        for (let batch in data) {
          await pushData(data[batch], table, batch);
        }
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
