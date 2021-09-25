/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const { pushData } = require("/opt/nodejs/insertIntoDB");
const { tempDir, apiArray, fileName, csvFile } = require("./utils");
const getData = require("./getData");
const { calcInd, calcType, calcSubType } = require("./calculate");
const {
  downloadZip,
  extractDataFromCSV,
  cleanDirectory,
} = require("./bhavUtils");
const table = "Indices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";

const getAndPushData = async () => {
  for (let i = 0; i < apiArray.length; i++) {
    try {
      let dataFromNse;
      const { url,exchg, cat, type, subt, schema, codes } = apiArray[i];
      if (i === 0) {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        await mkdir(tempDir);
        await downloadZip(url, tempDir, csvFile);
        dataFromNse = await extractDataFromCSV(tempDir, fileName);
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
    } catch (err) {
      console.log(err);
    }
  }
};

exports.handler = async (event) => {
  return await getAndPushData();
};