const axios = require("axios");

const baseUrl = "https://www.nseindia.com";
let cookies = "";
let cookieUsedCount = 0;
let cookieMaxAge = 60; // should be in seconds
let cookieExpiry = new Date().getTime() + cookieMaxAge * 1000;
let noOfConnections = 0;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const getNseCookies = async () => {
  if (
    cookies === "" ||
    cookieUsedCount > 10 ||
    cookieExpiry <= new Date().getTime()
  ) {
    const response = await axios.get(baseUrl);
    const setCookies = response.headers["set-cookie"];
    let cookies = [];
    setCookies.forEach((cookie) => {
      const requiredCookies = ["nsit", "nseappid"];
      const cookieKeyValue = cookie.split(";")[0];
      const cookieEntry = cookieKeyValue.split("=");
      if (requiredCookies.includes(cookieEntry[0])) {
        cookies.push(cookieKeyValue);
      }
    });
    this.cookies = cookies.join("; ");
    this.cookieUsedCount = 0;
    this.cookieExpiry = new Date().getTime() + cookieMaxAge * 1000;
  }
  cookieUsedCount++;
  return this.cookies;
};

const getDataFromUrl = async (url) => {
  let retries = 0;
  let hasError = false;
  do {
    while (noOfConnections >= 5) {
      await sleep(500);
    }
    noOfConnections++;
    try {
      const response = await axios.get(url, {
        headers: {
          Cookie: await getNseCookies(),
        },
      });
      noOfConnections--;
      return response.data;
    } catch (error) {
      hasError = true;
      retries++;
      noOfConnections--;
      if (retries >= 10) throw error;
    }
  } while (hasError);
};

const getData = async (url, mcap, indices, isinMap, table) => {
  const schema = {};
  let batches = [];
  let count = 0;
  let batchRecords = [];
  let response;
  try {
    console.log(url, "before calling url");
    response = await getDataFromUrl(url, { timeout: 2000 });
    console.log(response.data);
    console.log(response.data[0]);
  } catch (err) {
    console.log(url, "after calling url");
    console.log(err);
    const { status } = err.response;
    console.log(status);
    return;
  }

  //   response.data.data.map((item, index) => {
  //     if (index === 0 && mcap) return;
  //     if (isinMap[item.meta.isin]) return;
  //     schema.id = item.meta.isin;
  //     schema.name = item.meta.companyName;
  //     schema.mcap = mcap;
  //     schema.ychg = item.perChange365d;
  //     schema.mchg = item.perChange30d;
  //     if (!mcap) {
  //       schema.yhigh = Math.round(item.wkhi * 100) / 100;
  //       schema.ylow = Math.round(item.wklo * 100) / 100;
  //       schema.ind = item.meta.industry;
  //       if (indices === "ETF") schema.index = item.assets;
  //     } else {
  //       schema.ind = item.meta.industry;
  //       schema.yhigh = Math.round(item.yearHigh * 100) / 100;
  //       schema.ylow = Math.round(item.yearLow * 100) / 100;
  //       schema.index = indices;
  //     }
  //     schema.__typename = table.slice(0, table.indexOf("-"));
  //     schema.createdAt = new Date().toISOString();
  //     schema.updatedAt = new Date().toISOString();
  //     isinMap[item.meta.isin] = item.meta.isin;
  //     const dataToPush = JSON.parse(JSON.stringify(schema));
  //     batches.push({ PutRequest: { Item: dataToPush } });
  //     count++;
  //     if (count === 25) {
  //       batchRecords.push(batches);
  //       batches = [];
  //       count = 0;
  //     }
  //   });

  //   if (count < 25 && count > 0) {
  //     batchRecords.push(batches);
  //   }
  //   return batchRecords;
};

module.exports = getData;
