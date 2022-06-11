const { getInstrumentsData, processData } = require("../src/processData");
const {
  getTableNameFromInitialWord,
  batchReadItem,
  getTabledata,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
  processInstruments,
  processHoldings,
  getCommodityList,
} = require("../src/data");
const {
  toHumanFriendlyCurrency,
  divideArrayBySize
} = require("../../moneoutilslayer/lib/nodejs/utility");
const { sendMessage } = require("../../moneoutilslayer/lib/nodejs/sqsUtils");
const {
  instrumentValuation,
} = require("../../moneovaluationlayer/lib/nodejs/alertsVal");
const {
  watchlistValuation,
} = require("../../moneovaluationlayer/lib/nodejs/watchlistVal");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneovaluationlayer/lib/nodejs/watchlistVal");
jest.mock("../../moneovaluationlayer/lib/nodejs/alertsVal");
jest.mock("../../moneoutilslayer/lib/nodejs/utility");
jest.mock("../../moneoutilslayer/lib/nodejs/sqsUtils");
jest.mock("../src/data");

describe("getInstrumentsData", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("Table");
    batchReadItem.mockReturnValue([
      { id: "GAIL", price: 100 },
      { id: "SAIL", price: 100 },
    ]);
    divideArrayBySize.mockReturnValue([ [ "GAIL", "SAIL" ] ])
  });

  test("With ids", async () => {
    await expect(
      getInstrumentsData(new Set(["GAIL", "SAIL"]), "Table", {})
    ).resolves.toStrictEqual({
      GAIL: { id: "GAIL", price: 100 },
      SAIL: { id: "SAIL", price: 100 },
    });
  });

  test("With Infomap", async () => {
    await expect(
      getInstrumentsData(new Set(["GAIL", "SAIL"]), "Table", {
        ITC: { id: "ITC", price: 100 },
      })
    ).resolves.toStrictEqual({
      GAIL: { id: "GAIL", price: 100 },
      SAIL: { id: "SAIL", price: 100 },
      ITC: { id: "ITC", price: 100 },
    });
  });

  test("Without Infomap && ids", async () => {
    await expect(
      getInstrumentsData(new Set(), "Table", {})
    ).resolves.toStrictEqual({});
  });
});

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("Inbond");
    getTabledata.mockReturnValue([
      { uname: "Mehz", email: "mehz1526@gmail.com" },
    ]);
    processInstruments.mockReturnValue({
      usersWatchMap: { Mehz: [{ id: "GAIL" }] },
      usersinsMap: { Mehz: [{ id: "GAIL" }] },
    });
    processHoldings.mockReturnValue(true);
    instrumentValuation.mockReturnValue(true);
    sendMessage.mockReturnValue(true);
    watchlistValuation.mockReturnValue(true);
    toHumanFriendlyCurrency(900);
    getCommodityList.mockReturnValue([
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

  test("should resolve", async () => {
    const data = await processData();
    expect(data).toBe(true);
  });

  test("should throw error", async () => {
    sendMessage.mockReturnValueOnce(undefined);
    try {
      await processData();
    } catch (e) {
      expect(e.toString()).toMatch(
        "Cannot read property 'length' of undefined"
      );
    }
  });
});
