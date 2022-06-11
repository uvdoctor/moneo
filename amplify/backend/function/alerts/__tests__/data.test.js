const {
  processInstruments,
  processHoldings,
  getCommodityList,
} = require("../src/data");
const {
  getTableNameFromInitialWord,
  filterTableByList,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
  getFXRate,
  getCryptoPrice,
  getCommodityPrice,
} = require("../../moneopricelayer/lib/nodejs/eod");
const { getInstrumentsData } = require("../src/processData");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../src/processData");
jest.mock("../../moneopricelayer/lib/nodejs/eod");

describe("processHoldings", () => {
  getTableNameFromInitialWord.mockReturnValue("Table");

  test("ins", async () => {
    filterTableByList.mockReturnValue([
      { uname: "Mehz", ins: [{ id: "GAIL" }], watch: [{ id: "GAIL" }] },
    ]);
    getInstrumentsData.mockReturnValue({
      GAIL: { id: "GAIL", price: 100 },
      SAIL: { id: "SAIL", price: 100 },
    });

    const data = await processInstruments(
      {},
      { Mehz: "mehzabeen1526@gmail.com" },
      {},
      {}
    );
    expect(data).toStrictEqual({
      usersWatchMap: { Mehz: [{ id: "GAIL" }] },
      usersinsMap: { Mehz: [{ id: "GAIL" }] },
    });
  });
});

describe("processHoldings", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("Table");
    filterTableByList.mockReturnValue([
      { uname: "Mehz", crypto: [{ id: "BTC" }], nps: [{ id: "HDFC" }] },
    ]);
    getInstrumentsData.mockReturnValue({
      BTC: { id: "BTC", price: 100 },
      HDFC: { id: "HDFC", price: 100 },
    });
    getFXRate.mockReturnValue(74);
    getCryptoPrice.mockReturnValue(75);
  });

  test("With data", async () => {
    await processHoldings(
      {
        GAIL: { id: "GAIL", price: 100 },
        SAIL: { id: "SAIL", price: 100 },
      },
      { Mehz: "mehzabeen1526@gmail.com" },
      { Mehz: [{ BTC: { id: "BTC", price: 100 } }] }
    );
    expect(filterTableByList).toHaveBeenCalled();
    expect(getInstrumentsData).toHaveBeenCalled();
    expect(getFXRate).toHaveBeenCalled();
    expect(getCryptoPrice).toHaveBeenCalled();
  });

  test("Without data", async () => {
    try {
      await processHoldings({}, {}, {});
    } catch (e) {
      expect(e.toString()).toMatch(
        "TypeError: usersinsMap[item.uname] is not iterable"
      );
    }
  });
});

describe("getCommodityList", () => {
  beforeEach(() => { 
    getFXRate.mockReturnValue(74);
  })
  test("With commodity Prie", async () => {
    getCommodityPrice.mockReturnValue([4000, 3000]);
    const data = await getCommodityList();
    expect(data).toEqual([
      {
        name: "10 grams of 24k Gold:",
        price: "₹79,232.24",
        chg: 25,
        up: false,
      },
      {
        name: "10 grams of 99.99% Silver:",
        price: "₹79,232.24",
        chg: 25,
        up: false,
      },
    ]);
  });

  test("Without commodity Prie", async () => {
    getCommodityPrice.mockReturnValue([]);
    const data = await getCommodityList();
    expect(data).toEqual([
      {
        name: "10 grams of 24k Gold:",
        price: "₹0.00",
        "chg": NaN,
        up: false,
      },
      {
        name: "10 grams of 99.99% Silver:",
        price: "₹0.00",
        "chg": NaN,
        up: false,
      },
    ]);
  });
});
