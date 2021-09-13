// const docClient = require("/opt/nodejs/insertIntoDB");
const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const txtToJson = require("txt-file-to-json");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const split = require("split");

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

const getDataFromTxtFile = async(tempDir, fileName, calc) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(split())
      .on("data", (record) => {
        const data = record.split(",");
        const [date, pensionNo, fundMng, id, name, nav] = data;
        if (!id) return;
        const schema = {
          id: id,
          pfm: calc.calcPFM(name),
          st: calc.calcST(name),
          name: name,
          type: calc.calcType(name),
          subt: calc.calcSubType(name),
          price: nav,
        };
        batches.push({ PutRequest: { Item: schema } });
        count++;
        if (count === 25) {
          batchRecords.push(batches);
          batches = [];
          count = 0;
        }
      })
      .on("end", async () => {
        if(count<25){
          batchRecords.push(batches)
        }
        await cleanDirectory(
          tempDir,
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve(batchRecords);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${fileName} txt file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

//   const dataInJSON = txtToJson({ filePath: `${tempDir}/${fileName}` });
//   return dataInJSON;
// };

module.exports = {
  downloadZip,
  unzipDownloads,
  cleanDirectory,
  getDataFromTxtFile,
  // pushData,
};
