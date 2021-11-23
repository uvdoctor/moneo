const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;

const getStr = (num) => num < 10 ? `0${num}` : '' + num;

const utility = (num) => {
    if (!num) num = 0;
    const monthsArray = [
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
    const todayDate = new Date() - parseInt(num);
    const monthChar = monthsArray[todayDate.getMonth()];
    const yearFull = todayDate.getFullYear();
    const dateStr = getStr(todayDate);
    const monthStr = getStr(todayDate.getMonth() + 1);
    const year =
      todayDate.getYear().toString().charAt(1) + todayDate.getYear().toString().charAt(2);
    return { dateStr, monthStr, monthChar, year, yearFull };
  };
  
  module.exports = { utility, tempDir, zipFile };