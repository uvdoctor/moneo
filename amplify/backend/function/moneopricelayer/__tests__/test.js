const {
  getEODdata,
  getSplitInfo,
  getDividendInfo,
  getFundamentalDataByLimit,
  getCryptoPrice,
  getCommodityPrice,
  getFXRate,
  getEODdataByDate,
} = require("../lib/nodejs/eod");

describe("Test Eod Price", () => {
  test("NSE - getEoddata", async () => {
    const data = await getEODdata("NSE");
    expect(data.length > 1000).toEqual(true);
  }, 10000);
  test("BSE - getEoddata", async () => {
    const data = await getEODdata("BSE");
    expect(data.length > 1000).toEqual(true);
  }, 100000);
  test("getSplitInfo", async () => {
    const data = await getSplitInfo("BSE");
    expect(data).toBeDefined();
  }, 100000);
  test("getDividendInfo", async () => {
    const data = await getDividendInfo("BSE");
    expect(data).toBeDefined();
  }, 100000);

  test("With date - getCryptoPrice", async () => {
    const data = await getCryptoPrice("BTC-USD", true);
    expect(data).toBeTruthy();
  }, 100000);
  test("Without date - getCryptoPrice", async () => {
    const data = await getCryptoPrice("BTC-USD");
    expect(data).toBeTruthy();
  }, 100000);

  test("With date - getCommodityPrice", async () => {
    const data = await getCommodityPrice("GC", true);
    expect(data.length).toBeTruthy();
  }, 100000);
  test("Without date - getCommodityPrice", async () => {
    const data = await getCommodityPrice("GC");
    expect(data).toBeTruthy();
  }, 100000);

  test("getFXRate", async () => {
    const data = await getFXRate("INR");
    expect(data).toBeTruthy();
  }, 100000);

  test("getEODdataByDate", async () => {
    const data = await getEODdataByDate("NSE", 1);
    expect(data.length).toBeTruthy();
  }, 100000);

  test("getFundamentalDataByLimit", async () => {
    const { data, url } = await getFundamentalDataByLimit("NSE", 500);
    expect(data).toBeTruthy();
    expect(url).toEqual(
      `https://eodhistoricaldata.com/api/bulk-fundamentals/NSE?api_token=61ff9bf3d40797.93512142&offset=500&limit=500&fmt=json`
    );
  }, 1000000);
});
