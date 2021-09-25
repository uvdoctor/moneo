const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;

const { utility } = require("opt/nodejs/utility");
const { date, month, yearFull } = utility();
const fileName = `NAV_File_${date}${month}${yearFull}`;

const apiArray = [
  {
    fileName: `${fileName}.out`,
    url: `https://npscra.nsdl.co.in/download/${fileName}.zip`,
  },
];

module.exports = { tempDir, zipFile, apiArray };