const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/databaseUtils");
const { getData } = require("./getData");
const table = "INMFPrice";

exports.handler = async (event) => {
  const tableName = await getTableNameFromInitialWord(table);
  console.log("Table name fetched: ", tableName);
  const data = await getData();
  if (!data) return;
  for (let batch in data) {
    await pushData(data[batch], tableName);
  }
  await pushDataForFeed(table, data);
};
