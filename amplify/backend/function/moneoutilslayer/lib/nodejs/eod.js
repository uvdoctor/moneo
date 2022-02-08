const axios = require("axios");
const token = "61ff9bf3d40797.93512142";
const getData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getEODdata = async (exchg) => {
  const url = `https://eodhistoricaldata.com/api/eod-bulk-last-day/${exchg}?api_token=${token}&fmt=json&filter=extended`;
  return await getData(url);
};

const getFundamentalData = async (symbol, exchg) => {
  const url = `https://eodhistoricaldata.com/api/fundamentals/${symbol}.${exchg}?api_token=${token}`;
  const data = await getData(url);
  const {
    General,
    AnalystRatings,
    Earnings,
    Financials,
    Highlights,
    Holders,
    InsiderTransactions,
    SharesStats,
    SplitsDividends,
    Technicals,
    Valuation,
    outstandingShares,
  } = data;
  return {
    General,
    AnalystRatings,
    Earnings,
    Financials,
    Highlights,
    Holders,
    InsiderTransactions,
    SharesStats,
    SplitsDividends,
    Technicals,
    Valuation,
    outstandingShares,
  };
};

module.exports = { getEODdata, getFundamentalData };
