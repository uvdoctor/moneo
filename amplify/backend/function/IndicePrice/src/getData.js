const axios = require("axios");
const { calcInd, calcType, calcSubType, calcPrevPrice } = require("./calculate");
const { appendGenericFields } = require("/opt/nodejs/utility");

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
    const { data } = await axios.get(url);
    dataToExtract = data.EOD;
    if (exchg === "NSE") dataToExtract = nseData;
    if (type === "E" && cat !== "Volatility") dataToExtract = data.RealTime;
    dataToExtract.map((record) => {
      Object.keys(schema).map((key) => {
        switch (key) {
          case "price":
          case "pe":
          case "pb":
            return (schema[key] = record[codes[key]] ? (Math.round(record[codes[key]] * 100) / 100) : 0);
          case "prev":
            const prev = record[codes["chg"]] ? calcPrevPrice(schema.price, parseFloat(record[codes["chg"]])) : 0;
            if(exchg === "NSE") schema[key] = prev;
            if(exchg === "BSE") {
              schema[key] = record[codes[key]] ? parseFloat(record[codes[key]]) : 0;
            }
            return;
          case "name":
            return (schema[key] = record[codes[key]].trim());
          case "yhigh":
            return (schema[key] = Math.round(record[codes[key]] * 100) / 100);
          case "ylow":
            return (schema[key] = Math.round(record[codes[key]] * 100) / 100);
          case "ind":
            return (schema[key] = calcInd(record[codes[key]]));
          case "id":
            return schema[key] = record[codes[key]].trim();
        }
      });
      schema.exchg = exchg;
      schema.type = type ? type : calcType(record[codes.name]);
      schema.subt = subt ? subt : calcSubType(record[codes.name]);
      schema.curr = "INR";
      appendGenericFields(schema, table)

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

module.exports = getData;
