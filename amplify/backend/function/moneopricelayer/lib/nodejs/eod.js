const axios = require("axios");
const token = "61ff9bf3d40797.93512142";
let prev = 1;
const getStr = (num) => (num < 10 ? `0${num}` : "" + num);
const getData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getCustomDate = (num) => {
  if (!num) num = 0;
  const today = new Date();
  const customDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - parseInt(num)
  );
  const date = customDate.getDate();
  const month = customDate.getMonth() + 1;
  const year = customDate.getFullYear();
  const awsdate = `${year}-${getStr(month)}-${getStr(date)}`;
  return awsdate;
};

const getEODdata = async (exchg) => {
  const url = `https://eodhistoricaldata.com/api/eod-bulk-last-day/${exchg}?api_token=${token}&fmt=json&filter=extended`;
  return await getData(url);
};

const getEODdataByDate = async (exchg, diff) => {
  const prevDiff = prev === 5 ? diff : !diff ? prev : diff + prev;
  const date = getCustomDate(prevDiff);
  const url = `https://eodhistoricaldata.com/api/eod-bulk-last-day/${exchg}?api_token=${token}&fmt=json&date=${date}`;
  let data = await getData(url);
  if(prev <= 5 && !data.length) {
    prev++;
    data = await getEODdataByDate(exchg, diff);
  }
  return data;
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

const getCryptoPrice = async (symbol, isDate) => {
  const date = getCustomDate(prev);
  let url = !isDate
    ? `https://eodhistoricaldata.com/api/real-time/${symbol}.CC?api_token=${token}&fmt=json&filter=close`
    : `https://eodhistoricaldata.com/api/eod/${symbol}.CC?api_token=${token}&fmt=json&from=${date}&filter=close`;
  let data = await getData(url);
  if (isDate && (!Array.isArray(data) || !data?.length) && prev <= 5) {
    prev++;
    data = await getCryptoPrice(symbol, isDate);
  }
  return Array.isArray(data) ? data[1] : data;
};

const getCommodityPrice = async (symbol, isDate) => {
  const date = getCustomDate(prev);
  let url = !isDate
    ? `https://eodhistoricaldata.com/api/eod/${symbol}.COMM?api_token=${token}&fmt=json&filter=last_close`
    : `https://eodhistoricaldata.com/api/eod/${symbol}.COMM?api_token=${token}&fmt=json&from=${date}&filter=close`;
  let data = await getData(url);
  if (isDate && (!Array.isArray(data) || !data?.length) && prev <= 5) {
    prev++;
    data = await getCommodityPrice(symbol, isDate);
  }
  return data;
};

const getFXRate = async (curr) => {
  let url = `https://eodhistoricaldata.com/api/real-time/${curr}.FOREX?api_token=${token}&fmt=json`;
  const response = await getData(url);
  return await response.close;
};

const getIndexComponents = async (symbol) => {
  let url = `https://eodhistoricaldata.com/api/fundamentals/${symbol}.INDX?api_token=${token}&fmt=json`;
  const response = await getData(url);
  return await response.Components;
};

const getIndexList = async () => {
  let url = `https://eodhistoricaldata.com/api/exchange-symbol-list/INDX?api_token=${token}&fmt=json`;
  const response = await getData(url);
  return await response;
  
}

module.exports = {
  getEODdata,
  getSplitInfo,
  getDividendInfo,
  getFundamentalDataByLimit,
  getCryptoPrice,
  getCommodityPrice,
  getFXRate,
  getEODdataByDate,
  getIndexComponents,
  getIndexList
};
