const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { tempDir } = require("/opt/nodejs/utility");

const extractDataFromExcel = async (fileName, table, isinMap) => {
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

module.exports = extractDataFromExcel;
