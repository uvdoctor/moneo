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
const todayDate = today.getDate();
const date = todayDate < 10 ? `0${todayDate}` : todayDate;
const month = months[today.getMonth()];
const year = today.getFullYear();
const fileName = "cm30JUL2021bhav.csv"; //`cm${date}${month}${year}bhav.csv`;

module.exports = {tempDir, zipFile, fileName}