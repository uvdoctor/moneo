const fs = require("fs");
const csv = require("csv-parser");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { tempDir } = require("/opt/nodejs/utility");
// const {
//   cleanDirectory,
// } = require("../../moneopricelayer/lib/nodejs/bhavUtils");
// const { tempDir } = require("../../moneopricelayer/lib/nodejs/utility");

const calculateSchema = (record, codes, sidMap) => {
  const today = new Date();
  const parse = (data) => (parseFloat(data) ? parseFloat(data) : null);
  const highdate = record[codes.yhighDate];
  const lowdate = record[codes.ylowDate];
  const yhighDate = highdate ? new Date(highdate) : "";
  const ylowDate = lowdate ? new Date(lowdate) : "";
  const ylow = parse(record[codes.ylow]);
  const yhigh = parse(record[codes.yhigh]);
  const sid = record[codes.sid];
  if (sidMap[sid]) return;
  const isTodayValue = (date, value) => {
    if (!date) return false;
    return (
      date.getMonth() === today.getMonth() &&
      date.getDate()  === today.getDate() &&
      value
    );
  };
  if (isTodayValue(yhighDate, yhigh)) {
    sidMap[sid] = { yhigh: yhigh };
  }
  if (isTodayValue(ylowDate, ylow)) {
    if (sidMap[sid]) {
      sidMap[sid] = { ...sidMap[sid], ylow: ylow };
    }
  }
};

const extractDataFromCSV = async (fileName, codes, sidMap) => {
  const end = new Promise((resolve, reject) => {
    const csvFormat = fileName.includes("CM_52_wk_High_low")
      ? csv({ headers: true })
      : csv();
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csvFormat)
      .on("data", (record) => {
        calculateSchema(record, codes, sidMap);
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve();
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${type} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

module.exports = extractDataFromCSV;
