/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray, csvFile } = utils;
const bhaoUtils = require("./bhavUtils");
const calcSchema = require("./calculate");
const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
} = bhaoUtils;
const table = "INBond-bvyjaqmusfh5zelcbeeji6xxoe-dev";
const instrumentList = [];

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { typeExchg, fileName, url, codes, schema } = apiArray[i];
        await mkdir(tempDir);
        if (url.includes("zip")) {
          await downloadZip(url, tempDir, zipFile);
          await unzipDownloads(zipFile, tempDir);
        }
        await downloadZip(url, tempDir, csvFile);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          typeExchg,
          codes,
          schema,
          calcSchema,
          instrumentList,
          table
        );
        for (let batch of data) {
          const details = await pushData(batch, table, instrumentList);
          console.log(details);
        }
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
