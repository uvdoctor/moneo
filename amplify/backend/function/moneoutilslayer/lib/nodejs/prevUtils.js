const { pushDataForFeed } = require("./databaseUtils")
let prevMap = {};
let prevDate = 1;

const getPrev = async (diff, downloadFile, constructedApiArray, table) => {
  const prevDiff = prevDate === 5 ? diff : !diff ? prevDate : diff + prevDate;
  try {
    const apiArray = constructedApiArray(prevDiff);
    await downloadFile(apiArray, prevMap, true);
  } catch (error) {
    if (prevDate === 4) {
      await pushDataForFeed(table, 0, "previous_file", apiArray.url, error.message);
    }
    prevDate++;
  }
  if (prevDate <= 5 && !Object.keys(prevMap).length) {
    await getPrev(diff, downloadFile, constructedApiArray, table);
  }
  return prevMap;
};

module.exports = { getPrev };
