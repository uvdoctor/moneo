const extractDataFromCSV = require("../src/bhavUtils");
let { downloadFile } = require("../src/getAndPushData");
const { cleanDirectory } = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
const { tempDir, utility } = require("../../moneoutilslayer/lib/nodejs/utility");
jest.mock("../src/bhavUtils");

describe("Test DownloadFile", () => {
  afterEach(async () => {
    await cleanDirectory(tempDir, "Directory Cleaned");
  });
  test("Date", async () => {
    extractDataFromCSV.mockReturnValueOnce(true);
    const { date, monthChar, month, yearFull } = utility(3);
    const nseFileName = `wdmlist_${date}${month}${yearFull}`;
    await expect(
      downloadFile(
        {
          typeExchg: "NSE",
          fileName: nseFileName,
          url: `https://www1.nseindia.com/content/historical/WDM/${yearFull}/${monthChar}/${nseFileName}.csv`,
        },
        {},
        false,
        []
      )
    ).resolves.toStrictEqual(true);
  });
});
