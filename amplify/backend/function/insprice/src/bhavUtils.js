const fs = require("fs");
const csv = require("csv-parser");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { tempDir } = require("/opt/nodejs/utility");
const { calcSchema } = require("./calculate");

const extractDataFromCSV = async (
  fileName,
  typeExchg,
  codes,
  schema,
  table,
  isinMap,
  metaDataArray,
  weekHighLowArray
) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (isinMap[record[codes.id]]) return;
        const updateSchema = calcSchema(
          record,
          codes,
          schema,
          typeExchg,
          isinMap,
          table
        );
        if (!updateSchema) return;
        const dataToPush = JSON.parse(JSON.stringify(updateSchema));
        metaDataArray.map((item) => {
          if (item.id === dataToPush.id) {
            dataToPush.name = item.name;
            dataToPush.fv = item.fv;
            if (item.under) dataToPush.under = item.under;
          }
        });
        weekHighLowArray.map((item) => {
          if (item.sid === dataToPush.sid) {
            dataToPush.yhigh = item.yhigh;
            dataToPush.ylow = item.ylow;
          }
        });
        batches.push({ PutRequest: { Item: dataToPush } });
        count++;
        if (count === 25) {
          batchRecords.push(batches);
          batches = [];
          count = 0;
        }
      })
      .on("end", async () => {
        if (count < 25 && count > 0) {
          batchRecords.push(batches);
        }
        await cleanDirectory(
          tempDir,
          `${fileName} of ${typeExchg} results extracted successfully and directory is cleaned`
        );
        resolve(batchRecords);
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

const extractPartOfData = async (
  fileName,
  codes,
  metaDataArray,
  weekHighLowArray
) => {
  const end = new Promise((resolve, reject) => {
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (fileName === "CM_52_wk_High_low_04102021.csv") {
          const schema = {
            sid: record[codes.sid],
            yhigh: record[codes.yhigh],
            ylow: record[codes.ylow],
          };
          weekHighLowArray.push(schema);
        } else {
          const schema = {
            id: record[codes.id],
            fv: Number(record[codes.fv]),
            name: record[codes.name],
          };
          if (fileName === "eq_etfseclist.csv")
            schema.under = record[codes.under];
          metaDataArray.push(schema);
        }
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
          `Unable to read ${fileName} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

const addMetaData = async (exchgData, getDataFromTable) => {
  const table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
  const data = await getDataFromTable(table);
  exchgData.map((element) => {
    element.map((item) => {
      const metaData = data.Items.find(
        (re) => re.id === item.PutRequest.Item.id
      );
      if (!metaData) return;
      item.PutRequest.Item.meta = metaData;
    });
  });

  return exchgData;
};

module.exports = {
  extractDataFromCSV,
  extractPartOfData,
  addMetaData,
};
