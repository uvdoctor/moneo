const { getAndPushData } = require('../src/getData')
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { getEODdata, getSplitInfo, getDividendInfo, getEODdataByDate } = require("../../moneopricelayer/lib/nodejs/eod");
const constructedApiArray = require("../src/utils");
const {
  extractPartOfData,
  extractDataFromCSV,
  mergeEodAndExchgData,
} = require("../src/bhavUtils");

jest.mock('../src/bhavUtils')
jest.mock('../src/utils')
jest.mock('../../moneopricelayer/lib/nodejs/eod')
jest.mock('../../moneoutilslayer/lib/nodejs/databaseUtils')

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    constructedApiArray.mockReturnValueOnce({ apiArray: [], partOfDataApiArray: [] });
    getTableNameFromInitialWord.mockReturnValue("INExchg");
    extractDataFromCSV.mockReturnValueOnce(true);
    extractPartOfData.mockReturnValue(50)
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValueOnce(true);
    getEODdataByDate.mockReturnValue(true);
    getEODdata.mockReturnValue(true);
    getSplitInfo.mockReturnValue(true);
    getDividendInfo.mockReturnValue(true);
    mergeEodAndExchgData.mockReturnValueOnce([]);
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