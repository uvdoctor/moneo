let { parseDataFromPDF, getAndPushData } = require("../src/getData");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");

describe("GetData", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("Inbond");
    parseDataFromPDF = jest.fn();
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValueOnce(true);
  });

  test("should resolve", async () => {
    const data = await getAndPushData();
    expect(data).toBe();
  });

  test("should throw error", async () => {
    pushData.mockReturnValueOnce(undefined);
    try {
      await getAndPushData();
    } catch (e) {
      expect(e.name.toString()).toMatch("MissingPDFException");
    }
  }, 1000000);
});
