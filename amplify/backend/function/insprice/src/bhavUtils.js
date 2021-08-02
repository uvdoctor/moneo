const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const csv = require("csv-parser");

const cleanDirectory = async (tempDir, msg) => {
  await rmdir(tempDir, { recursive: true });
  console.log(msg);
};

const downloadZip = (NSE_URL, tempDir, zipFile) => {
  return new Promise((resolve, reject) => {
    const req = https.get(NSE_URL, async (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        await cleanDirectory(
          tempDir,
          `Unable to download zip file, ${res.statusCode}`
        );
        return reject(new Error("statusCode=" + res.statusCode));
      }
      res.pipe(fs.createWriteStream(zipFile));
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
      dir: __dirname + "/temp",
    });
  } catch (err) {
    await cleanDirectory(tempDir, `Unable to extract zip file, ${err.message}`);
    throw new Error(err.message)
  }
};

const extractDataFromCSV = async (tempDir, fileName) => {
  const end = new Promise((resolve, reject) => {
    let results = []
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", ({ SYMBOL, ISIN, CLOSE }) => {
        results.push({ SYMBOL, ISIN, CLOSE });
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir, "Results extracted successfully and directory is cleaned"
        );
        resolve(results);
      })
      .on("error", (err) => {
        cleanDirectory(tempDir, `Unable to read csv file, ${err.message}`);
        throw new Error(err.message)
      });
  });
  return await end;
};


module.exports = { downloadZip, unzipDownloads, extractDataFromCSV };
