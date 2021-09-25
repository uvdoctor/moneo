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

const pushDataForFeed = async (
  table,
  data,
  pushData,
  identifier,
  url,
  exchg
) => {
  if (!identifier) identifier = "";
  const feedData = [];
  const tname = table.slice(0, table.indexOf("-"));
  const tableName = "Feeds-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
  const getLength = (arr) => {
    const len = arr.flat(Infinity);
    return len.length;
  };
  const schema = {
    id: `${tname}_${identifier}`,
    tname: tname,
    count: getLength(data),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __typename: tableName.slice(0, tableName.indexOf("-")),
  };
  if (exchg) schema.exchg = exchg;
  if (url) schema.url = url;
  feedData.push({ PutRequest: { Item: schema } });
  const results = await pushData(feedData, tableName);
  console.log(results, "Data Pushed into Feeds Table");
};

module.exports = { utility, pushDataForFeed };