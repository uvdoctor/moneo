const { utility } = require("/opt/nodejs/utility");
// const { utility } = require("../../moneopricelayer/lib/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, yearFull } = utility(diff);
  const weekHLFileName = `CM_52_wk_High_low_${date}${month}${yearFull}.csv`;

  const apiArray = [
    {
      exchg: "NSE",
      id: "NSE_PARTOF",
      fileName: weekHLFileName,
      url: `https://archives.nseindia.com/content/${weekHLFileName}`,
      codes: {
        sid: "_0",
        yhigh: "_2",
        yhighDate: "_3",
        ylow: "_4",
        ylowDate: "_5",
      },
    },
  ];

  return { apiArray };
};

module.exports = constructedApiArray;
