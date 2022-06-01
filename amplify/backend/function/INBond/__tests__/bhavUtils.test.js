const extractDataFromCSV = require("../src/bhavUtils");
const { calcSchema } = require("../src/calculate");

jest.mock("../src/calculate");

const codes = {
  sid: "SECURITY",
  id: "ISIN NO.",
  name: "ISSUE_DESC",
  price: "Last Traded Price (in Rs.)",
  subt: "SECTYPE",
  frate: "ISSUE_NAME",
  sDate: "ISSUE_DATE",
  mDate: "MAT_DATE",
  rate: "ISSUE_NAME",
  crstr: "",
  fv: "",
};

const schema = {
  id: "",
  sid: "",
  name: "",
  exchg: "",
  subt: "",
  price: 0,
  sm: 0,
  sy: 0,
  mm: 0,
  my: 0,
  rate: 0,
  itype: "",
  fv: 0,
  cr: null,
  crstr: null,
  ytm: 0,
  createdAt: "",
  updatedAt: "",
};

describe("Test Bhavutils", () => {
  test("File Exists", async () => {
    calcSchema.mockReturnValueOnce({
      exchg: "NSE",
      sid: "CG2036",
      name: "GOI LOAN 8.33% 2036",
      price: "108.65",
      id: "IN0020060045",
    });
    // keep file in tmp/temp folder
    await expect(
      extractDataFromCSV(
        // "wdmlist_30052022",
        "wdmlist_30052022.csv",
        "NSE",
        codes,
        schema,
        {},
        "INBond",
        {},
        false,
        []
      )
    ).resolves.toStrictEqual([
      [
        {
          PutRequest: {
            Item: {
              exchg: "NSE",
              id: "IN0020060045",
              name: "GOI LOAN 8.33% 2036",
              price: "108.65",
              sid: "CG2036",
            },
          },
        },
      ],
    ]);
  });

  test("Empty File", async () => {
    calcSchema.mockReturnValueOnce({
      exchg: "NSE",
      sid: "CG2036",
      name: "GOI LOAN 8.33% 2036",
      price: "108.65",
      id: "IN0020060045",
      STATUS: "Listed",
    });
    await expect(
      extractDataFromCSV(
        "empty_wdmlist_30052022.csv",
        "NSE",
        codes,
        schema,
        {},
        "INBond",
        {},
        false,
        []
      )
    ).resolves.toStrictEqual([]);
  });
});
