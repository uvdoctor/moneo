
const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, fileName, NSE_URL } = utils;
const bhaoUtils = require("./bhavUtils");
const { downloadZip, unzipDownloads, extractDataFromCSV, cleanDirectory, pushData } =
  bhaoUtils;

exports.handler = async (event) => {
  if (fs.existsSync(tempDir)) await cleanDirectory(tempDir, 'Initial cleaning completed');
  await mkdir(tempDir);
  await downloadZip(NSE_URL, tempDir, zipFile);
  await unzipDownloads(zipFile, tempDir);
  const data = await extractDataFromCSV(tempDir, fileName);
  return await pushData(data)
};
