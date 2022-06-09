let { parseDataFromPDF } = require("../src/getData");
const {
  appendGenericFields,
} = require("../../moneoutilslayer/lib/nodejs/utility");

jest.mock("../../moneoutilslayer/lib/nodejs/utility");

describe("GetData", () => {
  test("should resolve", async () => {
    appendGenericFields.mockReturnValue({});
    const data = await parseDataFromPDF(
      "https://www1.nseindia.com/content/indices/Index_Dashboard_APR2022.pdf",
      "table"
    );
    expect(data.length).toBe(80);
    expect(data[1]).toEqual({
      PutRequest: {
        Item: {
          beta: 0.93,
          corr: 0.83,
          div: 1.51,
          name: "NIFTY Next 50",
          p1m: 3.51,
          p1y: 23.71,
          p3m: 3.98,
          p3y: 16.4,
          p5y: 11.24,
          pb: 4.54,
          pe: 21.74,
          rsq: 0.69,
          vol: 17.51,
        },
      },
    });
  });

  test("should throw error", async () => {
    appendGenericFields.mockReturnValue({});

    try {
      await parseDataFromPDF(
        "https://www1.nseindia.com/content/indices/Index_Dashboard_JUN2022.pdf",
        "table"
      );
    } catch (e) {
      expect(e.name.toString()).toMatch("MissingPDFException");
    }
  });
});
