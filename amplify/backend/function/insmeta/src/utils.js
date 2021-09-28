const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, yearFull } = utility(diff);
  const nseData = `combined_report${date}${month}${yearFull}`;
  const apiArray = [
    {
      fileName: `${nseData}.xlsx`,
      url: `https://www1.nseindia.com/archives/combine_report/${nseData}.zip`,
      exchg: "NSE",
    },
  ];
  return apiArray;
};

module.exports = constructedApiArray;
