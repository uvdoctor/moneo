const extractDataFromCSV = require("../src/bhavUtils");
let { getAndPushData, downloadFile } = require("../src/getAndPushData");
const constructedApiArray = require("../src/utils");
const {
  cleanDirectory,
} = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
const { tempDir } = require("../../moneoutilslayer/lib/nodejs/utility");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
  getPrev,
  updatePrevByGetItem,
} = require("../../moneoutilslayer/lib/nodejs/prevUtils");

jest.mock("../src/bhavUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/prevUtils");
jest.mock("../src/utils");

jest.mock("../../moneoutilslayer/lib/nodejs/utility", () => ({
  tempDir: "C:\tmp\temp",
}));

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    constructedApiArray.mockReturnValueOnce([]);
    getTableNameFromInitialWord.mockReturnValue("Inbond");
    extractDataFromCSV.mockReturnValueOnce(true);
    getPrev.mockReturnValueOnce({});
    downloadFile = jest.fn();
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValueOnce(true);
    updatePrevByGetItem.mockReturnValueOnce(true);
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
        "Cannot read property 'length' of undefined"
      );
    }
  });
});
