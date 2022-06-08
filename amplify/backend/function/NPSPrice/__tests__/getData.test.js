let { getAndPushData, downloadFile } = require("../src/getData");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { getPrev } = require("../../moneoutilslayer/lib/nodejs/prevUtils");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/prevUtils");

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("NPSPrice");
    getPrev.mockReturnValueOnce({});
    downloadFile = jest.fn();
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValueOnce(true);
  });

  test("should resolve", async () => {
    const data = await getAndPushData(1);
    expect(data).toBe();
  });

  test("should throw error", async () => {
    getTableNameFromInitialWord.mockReturnValueOnce(undefined);
    try {
      await getAndPushData();
    } catch (e) {
      expect(e.toString()).toMatch('Error: statusCode=404');
    }
  });
});
