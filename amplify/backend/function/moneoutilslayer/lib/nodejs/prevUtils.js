const { pushDataForFeed, batchReadItem, pushData } = require("./databaseUtils")
const { divideArrayBySize } = require("./utility");

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

const updatePrevByGetItem = async (prevBatch, tableName) => {
  const prevBatchIds = Object.keys(prevBatch);
  const writeItemArray = divideArrayBySize(JSON.parse(JSON.stringify(prevBatchIds)), 25);
	const getItemArray = divideArrayBySize(JSON.parse(JSON.stringify(prevBatchIds)),100);
	let prevData = [];
  try {
		// getItem
		for (arrays of getItemArray) {
			let prevKeys = []
			arrays.map((id) => prevKeys.push({ id: id }));
			const data = await batchReadItem(tableName, prevKeys);
			prevData = [...prevData, ...data];
		}
		// writeItem
		for (arrays of writeItemArray) {
			let batch = []
			for (id of arrays) {
				const data = prevData.find((item) => item.id === id);
				if (!data) return;
				prevBatch[id].prev = data.price;
				batch.push({ PutRequest: { Item: prevBatch[id] }});
			}
		  const data = await pushData(batch, tableName);
      console.log(data);
		}
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getPrev, updatePrevByGetItem };
