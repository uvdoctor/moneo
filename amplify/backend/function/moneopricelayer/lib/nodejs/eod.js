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

const getFundamentalDataByLimit = async (exchg, offset) => {
  const url = `https://eodhistoricaldata.com/api/bulk-fundamentals/${exchg}?api_token=${token}&offset=${offset}&limit=500&fmt=json`;
  const data = await getData(url);
  return { data, url };
};

const getSplitInfo = async (exchg) => {
  const url = `https://eodhistoricaldata.com/api/eod-bulk-last-day/${exchg}?api_token=${token}&type=splits&fmt=json`;
  return await getData(url);
};

const getDividendInfo = async (exchg) => {
  const url = `https://eodhistoricaldata.com/api/eod-bulk-last-day/${exchg}?api_token=${token}&type=dividends&fmt=json`;
  return await getData(url);
};

const getCryptoPrice = async (symbol, date) => {
  let url = !date
    ? `https://eodhistoricaldata.com/api/real-time/${symbol}.CC?api_token=${token}&fmt=json&filter=close`
    : `https://eodhistoricaldata.com/api/eod/${symbol}.CC?api_token=${token}&fmt=json&from=${date}&filter=close`;
  return await getData(url);
};

const getCommodityPrice = async (symbol, date) => {
  let url = !date
    ? `https://eodhistoricaldata.com/api/eod/${symbol}.COMM?api_token=${token}&fmt=json&filter=last_close`
    : `https://eodhistoricaldata.com/api/eod/${symbol}.COMM?api_token=${token}&fmt=json&from=${date}&filter=close`;
  return await getData(url);
};

const getFXRate = async (curr) => {
  let url = `https://eodhistoricaldata.com/api/real-time/${curr}.FOREX?api_token=${token}&fmt=json`;
  const response = await getData(url);
  return await response.close;
}

module.exports = {
  getEODdata,
  getSplitInfo,
  getDividendInfo,
  getFundamentalDataByLimit,
  getCryptoPrice,
  getCommodityPrice,
  getFXRate
};
