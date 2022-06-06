const axios = require("axios");
const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  calcInd,
  calcType,
  calcSubType,
  calcPrevPrice,
} = require("./calculate");
const { pushData, pushDataForFeed, getTableNameFromInitialWord } = require("/opt/nodejs/databaseUtils");
const { cleanDirectory, downloadZip } = require("/opt/nodejs/downloadUtils");
const { tempDir, appendGenericFields } = require('/opt/nodejs/utility');
// const {
//   pushData,
//   pushDataForFeed,
//   getTableNameFromInitialWord,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const {
//   cleanDirectory,
//   downloadZip,
// } = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
// const {
//   tempDir,
//   appendGenericFields,
// } = require("../../moneoutilslayer/lib/nodejs/utility");
const constructedApiArray = require("./utils");
const extractDataFromCSV = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "AllIndices";
let dataFromNse;

const getData = async (
  nseData,
  table,
  url,
  cat,
  type,
  subt,
  schema,
  codes,
  exchg
) => {
  let batches = [];
  let count = 0;
  let batchRecords = [];
  let dataToExtract;
  try {
    if (exchg === "NSE") dataToExtract = nseData;
    else {
      const { data } = await axios.get(url);
      dataToExtract = data.EOD;
      if (type === "E" && cat !== "Volatility") dataToExtract = data.RealTime;
    }
    dataToExtract.map((record) => {
      Object.keys(schema).map((key) => {
        switch (key) {
          case "price":
          case "pe":
          case "pb":
            return (schema[key] = record[codes[key]]
              ? Math.round(record[codes[key]] * 100) / 100
              : 0);
          case "prev":
            const prev = record[codes["chg"]]
              ? calcPrevPrice(schema.price, parseFloat(record[codes["chg"]]))
              : 0;
            if (exchg === "NSE") schema[key] = prev;
            if (exchg === "BSE") {
              schema[key] = record[codes[key]]
                ? parseFloat(record[codes[key]])
                : 0;
            }
            return;
          case "name":
            return (schema[key] = record[codes[key]]?.trim());
          case "yhigh":
            return (schema[key] = Math.round(record[codes[key]] * 100) / 100);
          case "ylow":
            return (schema[key] = Math.round(record[codes[key]] * 100) / 100);
          case "ind":
            return (schema[key] = calcInd(record[codes[key]]));
          case "id":
            return (schema[key] = record[codes[key]]?.trim());
        }
      });
      schema.exchg = exchg;
      schema.type = type ? type : calcType(record[codes.name]);
      schema.subt = subt ? subt : calcSubType(record[codes.name]);
      schema.curr = "INR";
      appendGenericFields(schema, table);

      const dataToPush = JSON.parse(JSON.stringify(schema));
      batches.push({ PutRequest: { Item: dataToPush } });
      count++;
      if (count === 25) {
        batchRecords.push(batches);
        batches = [];
        count = 0;
      }
    });

    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    return batchRecords;
  } catch (err) {
    throw new Error(err.toString());
  }
};

const getAndPushData = async (diff) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tableName = await getTableNameFromInitialWord(table);
      console.log("Table name fetched: ", tableName);
      const apiArray = constructedApiArray(diff);
      for (let i = 0; i < apiArray.length; i++) {
        try {
          const { fileName, url, exchg, cat, type, subt, schema, codes } =
            apiArray[i];
          if (i === 0) {
            if (fs.existsSync(tempDir)) {
              await cleanDirectory(tempDir, "Initial cleaning completed");
            }
            await mkdir(tempDir);
            const csvFile = `${tempDir}/${fileName}`;
            await downloadZip(url, tempDir, csvFile);
            dataFromNse = await extractDataFromCSV(fileName);
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
            exchg
          );
          for (let batch in data) {
            const results = await pushData(data[batch], tableName);
            console.log(results);
          }
          await pushDataForFeed(table, data, cat, url, exchg);
        } catch (err) {
          console.log(err);
        }
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { getData, getAndPushData };
