const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;
const today = new Date();
const todayDate = today.getDate() - 4;
const date = todayDate < 10 ? `0${todayDate}` : todayDate;

const month =
  today.getMonth() + 1 < 10
    ? `0${today.getMonth() + 1}`
    : `${today.getMonth() + 1}`;
const yearFull = today.getFullYear();
const fileName = `NAV_File_${date}${month}${yearFull}`;
const apiArray = [
  {
    typeExchg: "NSE",
    fileName: `${fileName}.out`,
    url: `https://npscra.nsdl.co.in/download/${fileName}.zip`,
  },
];

module.exports = { tempDir, zipFile, apiArray };
