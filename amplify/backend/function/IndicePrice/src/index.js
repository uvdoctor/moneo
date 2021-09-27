const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const { pushData } = require("/opt/nodejs/insertIntoDB");
const { pushDataForFeed } = require("/opt/nodejs/utility");
const { tempDir, apiArray, fileName, csvFile } = require("./utils");
const { cleanDirectory, downloadZip } = require("opt/nodejs/bhavUtils");
const getData = require("./getData");
const { calcInd, calcType, calcSubType } = require("./calculate");
const extractDataFromCSV = require("./bhavUtils");
const table = "Indices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
let dataFromNse;

const getAndPushData = async () => {
  for (let i = 0; i < apiArray.length; i++) {
    try {
      const { url, exchg, cat, type, subt, schema, codes } = apiArray[i];
      if (i === 0) {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        await mkdir(tempDir);
        await downloadZip(url, tempDir, csvFile);
        dataFromNse = await extractDataFromCSV(
          tempDir,
          fileName,
          cleanDirectory
        );
      }
      const data = await getData(
        dataFromNse,
        table,
        url,
        cat,
        type,
        subt,
        schema,
        codes,
        calcInd,
        calcType,
        calcSubType,
        exchg
      );
      for (let batch in data) {
        const results = await pushData(data[batch], table);
        console.log(results);
      }

      await pushDataForFeed(table, data, pushData, cat, url, exchg);
    } catch (err) {
      console.log(err);
    }
  }
};

exports.handler = async (event) => {
  return await getAndPushData();
};
