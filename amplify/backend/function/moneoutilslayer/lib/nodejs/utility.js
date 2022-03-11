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
    const today = new Date();
    const customDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - parseInt(num));
    const monthChar = monthsArray[customDate.getMonth()];
    const yearFull = customDate.getFullYear();
    const date = getStr(customDate.getDate());
    const month = getStr(customDate.getMonth() + 1);
    const year = customDate.getYear().toString().charAt(1) + customDate.getYear().toString().charAt(2);
    return { date, month, monthChar, year, yearFull };
  };

  const divideArrayBySize = (array, size) => {
    let splittedArray = [];
    const mainArray = JSON.parse(JSON.stringify(array));
    if (mainArray.length > size) {
      while (mainArray.length > 0) {
        splittedArray.push(mainArray.splice(0, size));
      }
    } else {
      splittedArray = [ mainArray ];
    }
    return splittedArray;
  }

  const awsdate = (dateStr) => {
    if(!dateStr) return;
    const today = new Date(dateStr);
    const date = today.getDate();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    return (`${year}-${getStr(month)}-${getStr(date)}`);
  }

  module.exports = { utility, tempDir, zipFile, divideArrayBySize, awsdate };