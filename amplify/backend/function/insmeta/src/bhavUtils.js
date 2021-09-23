const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const excelToJson = require("convert-excel-to-json");

const cleanDirectory = async (tempDir, msg) => {
  await rmdir(tempDir, { recursive: true });
  console.log(msg);
};

const downloadZip = (url, tempDir, file) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, async (res) => {
      const { statusCode } = res;
      if (statusCode < 200 || statusCode >= 300) {
        await cleanDirectory(
          tempDir,
          `Unable to download zip file, ${statusCode}`
        );
        return reject(new Error("statusCode=" + statusCode));
      }
      res.pipe(fs.createWriteStream(file));
      res.on("end", function () {
        resolve();
      });
    });
    req.on("error", async (e) => {
      await cleanDirectory(
        tempDir,
        `Unable to download zip file, ${e.message}`
      );
      reject(e.message);
    });
    req.end();
  });
};

const unzipDownloads = async (zipFile, tempDir) => {
  try {
    await extract(zipFile, {
      dir: tempDir,
    });
  } catch (err) {
    await cleanDirectory(tempDir, `Unable to extract zip file, ${err.message}`);
    throw new Error(err.message);
  }
};

const extractDataFromExcel = async (tempDir, fileName, table, isinMap) => {
  let batches = [];
  let count = 0;
  const batchRecords = [];
  const result = excelToJson({
    sourceFile: `${tempDir}/${fileName}`,
  });
  result["Report 1"].map((item, ind) => {
    if (isinMap[item["C"]]) return;
    if (ind === 0) return;
    if (!item["I"]) return;
    const schema = {
      id: item["C"],
      name: item["H"],
      ylow: item["AC"],
      yhigh: item["AA"],
      fv: item["J"],
      __typename: table.slice(0, table.indexOf("-")),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    isinMap[item["C"]] = item["C"];
    batches.push({ PutRequest: { Item: schema } });
    count++;
    if (count === 25) {
      batchRecords.push(batches);
      batches = [];
      count = 0;
    }
  });
  if (count < 25 && count > 0) batchRecords.push(batches);

  await cleanDirectory(
    tempDir,
    `${fileName} results extracted successfully and directory is cleaned`
  );
  return batchRecords;
};

module.exports = {
  downloadZip,
  unzipDownloads,
  extractDataFromExcel,
  cleanDirectory,
};
