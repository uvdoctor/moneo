const fs = require("fs");
const csv = require("csv-parser");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { tempDir } = require("/opt/nodejs/utility");
const { calcSchema } = require("./calculate");
const { getCBDataByISIN, calculateYTM } = require("/opt/nodejs/corporateBond");

const extractDataFromCSV = async (
  fileName,
  exchg,
  codes,
  schema,
  table,
  isinMap,
  nameMap,
  weekHLMap,
  bondTable
) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    let bondCount = 0;
    let bondBatches = [];
    let bondBatchRecords = [];
    const stream = fs
      .createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", async (record) => {
        if (isinMap[record[codes.id]]) return;
        const { updateSchema, isBond } = calcSchema(
          record,
          codes,
          schema,
          exchg,
          isinMap,
          table,
          bondTable
        );
        if (!updateSchema) return;
        const dataToPush = JSON.parse(JSON.stringify(updateSchema));
        if (isBond) {
          let cbdata;
          try {
            stream.pause();
            cbdata = await getCBDataByISIN(dataToPush.id);
          } finally {
            stream.resume();
          }
          if (cbdata) {
            const { sm, sy, mm, my, rate, fv, name } = cbdata;
            dataToPush.sm = sm;
            dataToPush.sy = sy;
            dataToPush.mm = mm;
            dataToPush.my = my;
            dataToPush.rate = rate ? Number(rate) : -1;
            dataToPush.fv = Number(fv);
            dataToPush.name = name;
            dataToPush.ytm = calculateYTM(
              rate,
              sm,
              sy,
              mm,
              my,
              fv,
              dataToPush.price
            );
          }
          bondBatches.push({ PutRequest: { Item: dataToPush } });
          bondCount++;
          if (bondCount === 25) {
            bondBatchRecords.push(bondBatches);
            bondBatches = [];
            bondCount = 0;
          }
        } else {
          const id = dataToPush.id;
          const sid = dataToPush.sid;
          if (nameMap[id]) {
            dataToPush.name = nameMap[id].name;
            dataToPush.fv = nameMap[id].fv;
            if (nameMap[id].under) dataToPush.under = nameMap[id].under;
          }
          if (weekHLMap[sid]) {
            dataToPush.yhigh = weekHLMap[sid].yhigh;
            dataToPush.ylow = weekHLMap[sid].ylow;
          }
          batches.push({ PutRequest: { Item: dataToPush } });
          count++;
          if (count === 25) {
            batchRecords.push(batches);
            batches = [];
            count = 0;
          }
        }
      })
      .on("end", async () => {
        if (count < 25 && count > 0) {
          batchRecords.push(batches);
        }
        if (bondCount < 25 && bondCount > 0) {
          bondBatchRecords.push(bondBatches);
        }
        await cleanDirectory(
          tempDir,
          `${fileName} of ${exchg} results extracted successfully and directory is cleaned`
        );
        const data = { exchgData: batchRecords, bondData: bondBatchRecords };
        resolve(data);
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

const extractPartOfData = async (fileName, codes, nameMap, weekHLMap) => {
  const end = new Promise((resolve, reject) => {
    let count = 0;
    const csvFormat = fileName.includes("CM_52_wk_High_low")
      ? csv({ headers: true })
      : csv();
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csvFormat)
      .on("data", (record) => {
        const parse = (data) => (parseFloat(data) ? parseFloat(data) : null);
        if (fileName.includes("CM_52_wk_High_low")) {
          weekHLMap[record[codes.sid]] = {
            yhigh: parse(record[codes.yhigh]),
            ylow: parse(record[codes.ylow]),
          };
        } else if (fileName === "eq_etfseclist.csv") {
          nameMap[record[codes.id]] = {
            fv: parse(record[codes.fv]),
            name: record[codes.name],
            under: record[codes.under],
          };
        } else {
          nameMap[record[codes.id]] = {
            fv: parse(record[codes.fv]),
            name: record[codes.name],
          };
        }
        count++;
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve(count);
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

const getMarketCapType = (marketcap) => {
  const mcap = marketcap / 10000000;
  if (mcap > 5000 && mcap < 20000) return "M";
  if (mcap > 20000) return "L";
  return "S";
};

const mergeEodAndExchgData = (exchgData, eodData) => {
  if (!eodData) return exchgData;
  exchgData.map((element) => {
    element.map((item) => {
      const data = eodData.find(
        (re) =>
          re.code.includes(item.PutRequest.Item.sid) ||
          item.PutRequest.Item.sid === re.code
      );
      if (!data) return;
      const {
        code,
        name,
        MarketCapitalization,
        adjusted_close,
        hi_250d,
        lo_250d,
        close,
        Beta,
      } = data;
      item.PutRequest.Item.sid = code;
      item.PutRequest.Item.name = name;
      item.PutRequest.Item.price = adjusted_close;
      item.PutRequest.Item.prev = close;
      item.PutRequest.Item.yhigh = hi_250d;
      item.PutRequest.Item.ylow = lo_250d;
      item.PutRequest.Item.beta = Beta;
      item.PutRequest.Item.mcap = MarketCapitalization;
      item.PutRequest.Item.mcapt = getMarketCapType(MarketCapitalization);
    });
  });
  return exchgData;
};

const addMetaData = async (exchgData, data) => {
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
  mergeEodAndExchgData,
};
