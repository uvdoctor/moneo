const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, yearFull } = utility(diff);
  const nseData = `combined_report${date}${month}${yearFull}`;
  // const mCap = `MCAP${date}${month}${yearFull}_0`;
  const apiArray = [
    {
      fileName: `${nseData}.xlsx`,
      url: `https://www1.nseindia.com/archives/combine_report/${nseData}.zip`,
      exchg: "NSE",
    },
    // {
    //   fileName: `${mCap}.xlsx`,
    //   url: `https://static.nseindia.com//s3fs-public/inline-files/${mCap}.xlsx`,
    //   exchg: "NSE_mCap",
    // },
  ];
  return apiArray;
};

module.exports = constructedApiArray;
