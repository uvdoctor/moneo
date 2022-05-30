const extractDataFromCSV = require("../src/bhavUtils");
const { createReadStream } = require("fs");

jest.mock("fs");

describe("Test Bhavutils", () => {
  test("Ex 1", async () => {
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, handler) {
        handler();
        return this;
      }),
    };

    createReadStream.mockReturnValueOnce(mockReadStream);

    await extractDataFromCSV(
      "EQ_ISINCODE_250322.CSV",
      "NSE",
      {
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
      },
      {
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
      },
      {},
      "INBond",
      {},
      false,
      []
    );

    expect(createReadStream).toBeCalledTimes(1);
    expect(mockReadStream.pipe).toBeCalledTimes(1);
    expect(mockReadStream.on).toBeCalledWith("data", expect.any(Function));
    expect(mockReadStream.on).toBeCalledWith("end", expect.any(Function));
  });
});
