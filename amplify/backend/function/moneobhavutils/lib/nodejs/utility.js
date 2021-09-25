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
  const monthChar = monthsArray[today.getMonth()];
  const yearFull = today.getFullYear();
  const todayDate = today.getDate() - parseInt(num);
  const date = todayDate < 10 ? `0${todayDate}` : todayDate;
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;
  const year =
    today.getYear().toString().charAt(1) + today.getYear().toString().charAt(2);
  return { date, month, monthChar, year, yearFull };
};

// const pushDataForFeed = async (
//   table,
//   batchRecords,
//   url,
//   identifier,
//   pushData
// ) => {
//   const feedData = [];
//   const tableName = "";
//   const getLength = (arr) => {
//     const len = arr.flat(Infinity);
//     return len.length;
//   };
//   const schema = {
//     id: table.slice(0, table.indexOf("-")) + identifier,
//     count: getLength(batchRecords),
//     url: url,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     __typename: tableName.slice(0, tableName.indexOf("-")),
//   };
//   const batches = [{ PutRequest: { Item: schema } }];
//   feedData.push(batches);
//   await pushData(feedData, table);
// };

module.exports = { utility };