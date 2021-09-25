const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;
const utility = require("opt/nodejs/utility");
const { date, month, yearFull } = utility();
const nseData = `combined_report${date}${month}${yearFull}`;
const apiArray = [
  {
    fileName: `${nseData}.xlsx`,
    url: `https://www1.nseindia.com/archives/combine_report/${nseData}.zip`,
  },
];

module.exports = { tempDir, zipFile, apiArray };