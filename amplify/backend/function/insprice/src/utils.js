const tempDir = `${__dirname}/temp`;
const zipFile = `${tempDir}/download.zip`;
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const today = new Date();
const todayDate = today.getDate() - 1;
const date = todayDate < 10 ? `0${todayDate}` : todayDate;
const month = months[today.getMonth()];
const year = today.getFullYear();
const fileName = `cm${date}${month}${year}bhav.csv`; //"cm30JUL2021bhav.csv"; 
const NSE_URL = `https://www1.nseindia.com/content/historical/EQUITIES/${year}/${month}/${fileName}.zip`
module.exports = {tempDir, zipFile, fileName, NSE_URL}