let { getAndPushData, arrangeData } = require("../src/getData");
const {
  getIndexComponents,
  getIndexList,
} = require("../../moneopricelayer/lib/nodejs/eod");
const {
  appendGenericFields,
  divideArrayBySize,
} = require("../../moneoutilslayer/lib/nodejs/utility");
const {
  getTableNameFromInitialWord,
  pushData,
  pushDataForFeed,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");

jest.mock("../../moneopricelayer/lib/nodejs/eod");
jest.mock("../../moneoutilslayer/lib/nodejs/utility");
jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");

describe("Arrange Data", () => {
  appendGenericFields.mockReturnValue({});
  getIndexComponents.mockReturnValue({
    0: { Code: "ITC" },
    1: { Code: "TATA" },
  });
  test("With IndexList", async () => {
    await expect(
      arrangeData([{ Code: "NIFTY", Name: "Nifty 50" }])
    ).resolves.toStrictEqual([
      {
        PutRequest: {
          Item: {
            comp: ["ITC", "TATA"],
            name: "Nifty 50",
          },
        },
      },
    ]);
  });

  test("With Empty IndexList", async () => {
    await expect(arrangeData([])).resolves.toStrictEqual([]);
  });
});

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("Table");
    getIndexList.mockReturnValueOnce([{ Code: "NIFTY", Name: "Nifty 50" }]);
    divideArrayBySize.mockReturnValueOnce(true);
    arrangeData = jest.fn();
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValueOnce(true);
  });

  test("should resolve", async () => {
    const data = await getAndPushData();
    expect(data).toBe();
  });

  test("should throw error", async () => {
    getIndexList.mockReturnValueOnce(undefined);
    try {
      await getAndPushData();
    } catch (e) {
      expect(e.toString()).toMatch(
        "Cannot read property 'length' of undefined"
      );
    }
  });
});
