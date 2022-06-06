let { getData, getAndPushData } = require("../src/getData");
const extractDataFromCSV = require("../src/bhavUtils");
const constructedApiArray = require("../src/utils");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");

jest.mock("../src/bhavUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../src/utils");
jest.mock("../../moneoutilslayer/lib/nodejs/utility");

jest.mock("../../moneoutilslayer/lib/nodejs/utility", () => ({
  tempDir: "C:\tmp\temp",
}));

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    constructedApiArray.mockReturnValue([]);
    getTableNameFromInitialWord.mockReturnValue("Table");
    extractDataFromCSV.mockReturnValueOnce(true);
    getData = jest.fn();
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValue(true);
  });

  test("should resolve", async () => {
    const data = await getAndPushData();
    expect(data).toBe();
  });

  test("should throw error", async () => {
    constructedApiArray.mockReturnValueOnce(undefined);
    try {
      await getAndPushData();
    } catch (e) {
      expect(e.toString()).toMatch(
        "TypeError: Cannot read properties of undefined (reading 'length')" 
      );
    }
  });
});
