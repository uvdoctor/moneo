const { pushDataForFeed } = require("./databaseUtils")
let prevMap = {};
let prevDate = 1;

const getPrev = async (diff, downloadFile, constructedApiArray, table, index) => {
  const prevDiff = prevDate === 5 ? diff : !diff ? prevDate : diff + prevDate;
  const apiArray = constructedApiArray(prevDiff);
  const apiInfo = Array.isArray(apiArray) ? apiArray[index] : apiArray;
  try {
    await downloadFile(apiInfo, prevMap, true);
  } catch (error) {
    if (prevDate === 4) {
      await pushDataForFeed(table, 0, "previous_file", apiInfo.url, error.message);
    }
    prevDate++;
  }
  if (prevDate <= 5 && !Object.keys(prevMap).length) {
    await getPrev(diff, downloadFile, constructedApiArray, table, index);
  }
  return prevMap;
};

module.exports = { getPrev };
