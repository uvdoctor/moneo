/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray } = utils;
const bhaoUtils = require("./bhavUtils");
const calcSchema = require("./calculate");
const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
} = bhaoUtils;
const table = "INExchg-bvyjaqmusfh5zelcbeeji6xxoe-dev";
const instrumentList = [];

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { typeExchg, fileName, url, codes, schema, typeIdentifier } =
          apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          typeExchg,
          codes,
          typeIdentifier,
          schema,
          calcSchema,
          instrumentList
        );
        const details = await pushData(data, table);
        console.log(details);
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
