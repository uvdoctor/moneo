const {
  calcSchema,
  calc,
  getMonthYearByDate,
  calculateYTM,
} = require("../src/calculate");

describe("CalcSchema", () => {
  test("Schema", () => {
    const data = calcSchema(
      {
        SECURITY: "ABFL24",
        "ISIN NO.": "INE860H07GT8",
        ISSUE_DESC: "Aditya Birla Fin 8.65% 24 S C1",
        "Last Traded Price (in Rs.)": 0,
        SECTYPE: "DB",
        ISSUE_NAME: "8.65%",
        MAT_DATE: "12-Jun-2024",
        ISSUE_DATE: "12-Jun-2019",
      },
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
      },
      {
        id: "",
        sid: "",
        name: "",
        subt: "",
        price: 0,
        exchg: "",
        sm: 0,
        sy: 0,
        mm: 0,
        my: 0,
        rate: 0,
        fr: "",
        tf: "",
        fv: 0,
        cr: null,
        crstr: null,
        ytm: 0,
        createdAt: "",
        updatedAt: "",
      },
      "NSE",
      {},
      "Table"
    );
    expect(data).toEqual({
      id: "INE860H07GT8",
      sid: "ABFL24",
      name: "Aditya Birla Fin 8.65% 24 S C1",
      subt: "CB",
      price: 100,
      exchg: "NSE",
      sm: 6,
      sy: 2019,
      mm: 6,
      my: 2024,
      rate: 8.65,
      fr: false,
      tf: false,
      fv: 100,
      cr: null,
      crstr: null,
      ytm: 0.087,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: "F",
      __typename: "Table",
    });
  });
});

describe("Test Asset Subtype", () => {
  test("Other Gov. Bond", () => {
    const data = calc.calcSubType("AT");
    expect(data).toEqual("GBO");
  });
  test("Government Bond", () => {
    const data = calc.calcSubType("GS");
    expect(data).toEqual("GB");
  });
  test("With no subtype", () => {
    const data = calc.calcSubType("");
    expect(data).toEqual("CB");
  });
  test("Corporate Bond", () => {
    const data = calc.calcSubType("VD");
    expect(data).toEqual("CB");
  });
});

describe("Calculate Issue Period", () => {
  const { month, year } = getMonthYearByDate("09-Mar-2024");
  test("Month", () => {
    expect(month).toEqual(3);
  });
  test("Year", () => {
    expect(year).toEqual(2024);
  });
});

describe("Check Floating Rate", () => {
  test("With Floating", () => {
    const data = calc.calcFR("RESET");
    expect(data).toEqual(true);
  });
  test("Without Floating", () => {
    const data = calc.calcFR("7.45%");
    expect(data).toEqual(false);
  });
});

describe("Tax Free", () => {
  test("Tax Free Bond", () => {
    const data = calc.calcTF("IF");
    expect(data).toEqual(true);
  });
  test("Tax Bond", () => {
    const data = calc.calcTF("AT");
    expect(data).toEqual(false);
  });
});

describe("Calculate Credit Rating", () => {
  test("Excellent", () => {
    const data = calc.calcCR("CRISIL AA+");
    expect(data).toEqual("E");
  });
  test("High", () => {
    const data = calc.calcCR("ICRA A1+");
    expect(data).toEqual("H");
  });
  test("Medium", () => {
    const data = calc.calcCR("CARE BBB+");
    expect(data).toEqual("M");
  });
  test("Low", () => {
    const data = calc.calcCR("BB-");
    expect(data).toEqual("L");
  });
  test("Junk", () => {
    const data = calc.calcCR("B-");
    expect(data).toEqual("J");
  });
  test("Without Data", () => {
    const data = calc.calcCR("");
    expect(data).toEqual(null);
  });
});

describe("Calculate Price", () => {
  test("With Price", () => {
    const data = calc.calcPrice("99.6149");
    expect(data).toEqual(99.6149);
  });
  test("Without Price", () => {
    const data = calc.calcPrice("");
    expect(data).toEqual(100);
  });
});

describe("Calculate Yield To Maturity", () => {
  test("Incase of Floating Rate", () => {
    const data = calculateYTM(0, 2, 2014, 2, 2024, 100, 100.14);
    expect(data).toEqual(0);
  });
  test("Without Floating Rate", () => {
    const data = calculateYTM(9.11, 5, 2014, 5, 2024, 100, 109.9989);
    expect(data).toEqual(0.077);
  });
});
