const extractDataFromCSV = require("../src/bhavUtils");
const { getAndPushData, downloadFile } = require("../src/getAndPushData");
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
jest.mock("../src/getAndPushData");
jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/prevUtils");

describe("Test DownloadFile", () => {
  afterEach(async () => {
    await cleanDirectory(tempDir, "Directory Cleaned");
  });
  test("Date", async () => {
    extractDataFromCSV.mockReturnValueOnce(true);

    const nseFileName = `wdmlist_31052022`;
    await expect(
      downloadFile(
        {
          typeExchg: "NSE",
          fileName: nseFileName,
          url: `https://www1.nseindia.com/content/historical/WDM/2022/MAY/${nseFileName}.csv`,
        },
        {},
        false,
        []
      )
    ).resolves.toStrictEqual(true);
  });

  test("Date Exception", async () => {
    const nseFileName = `wdmlist_01062022`;
    await expect(
      downloadFile(
        {
          typeExchg: "NSE",
          fileName: nseFileName,
          url: `https://www1.nseindia.com/content/historical/WDM/2022/MAY/${nseFileName}.csv`,
        },
        {},
        false,
        []
      )
    ).rejects.toStrictEqual(new Error("statusCode=404"));
  });
});

describe("Test GetAndPushData", () => {
  test("Date", async () => {
    getTableNameFromInitialWord.mockReturnValue("Inbond");
    extractDataFromCSV.mockReturnValueOnce(true);
    getPrev.mockReturnValueOnce({});
    downloadFile.mockReturnValueOnce([]);
    pushData.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValueOnce(true);
    updatePrevByGetItem.mockReturnValueOnce(true);

    await expect(await getAndPushData()).resolves.toBe(true);
    // expect(getTableNameFromInitialWord).toBeCalledTimes(1);
    // expect(extractDataFromCSV).toBeCalledTimes(1);
    // expect(mockReadStream.on).toBeCalledWith("data", expect.any(Function));
    // expect(mockReadStream.on).toBeCalledWith("end", expect.any(Function));
  });
});
