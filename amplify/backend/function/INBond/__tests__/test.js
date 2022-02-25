const {
  calcSchema,
  calc,
  getMonthYearByDate,
  calculateYTM,
  calculateRisk
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
      risk: "C",
      itype: "DEB",
      rate: 8.65,
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
    const data = calc.calcSubType("GZ");
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

describe("Test Asset Instype", () => {
  test("Commercial Paper", () => {
    const data = calc.calcInsType("CP");
    expect(data).toEqual("CP");
  });
  test("Treasury Bill", () => {
    const data = calc.calcInsType("TB");
    expect(data).toEqual("TB");
  });
  test("Perpetual Bond", () => {
    const data = calc.calcInsType("BP");
    expect(data).toEqual("PB");
  });
  test("Tax Free Bond", () => {
    const data = calc.calcInsType("PF");
    expect(data).toEqual("TFB");
  });
  test("Floating Bond", () => {
    const data = calc.calcInsType("GF");
    expect(data).toEqual("FRB");
  });
  test("Debenture Bond", () => {
    const data = calc.calcInsType("DB");
    expect(data).toEqual("DEB");
  });
  test("Index Bond", () => {
    const data = calc.calcInsType("GI");
    expect(data).toEqual("IB");
  });
  test("Cumulative Bond", () => {
    const data = calc.calcInsType("PE");
    expect(data).toEqual("CB");
  });
  test("Certificate of Deposit", () => {
    const data = calc.calcInsType("CD");
    expect(data).toEqual("CD");
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

describe("Calculate Risk", () => {
  test("Excellent", () => {
    const data = calculateRisk("E", "CB");
    expect(data).toEqual("VC");
  });
  test("High", () => {
    const data = calculateRisk("H", "CB");
    expect(data).toEqual("C");
  });
  test("Medium", () => {
    const data = calculateRisk("M", "CB");
    expect(data).toEqual("M");
  });
  test("Low", () => {
    const data = calculateRisk("L", "CB");
    expect(data).toEqual("A");
  });
  test("Junk", () => {
    const data = calculateRisk("J", "CB");
    expect(data).toEqual("VA");
  });
  test("No Credit rating in case of government bond", () => {
    const data = calculateRisk("", "GBO");
    expect(data).toEqual("VC");
  });
  test("No Credit rating in case of corporate bond", () => {
    const data = calculateRisk("", "CB");
    expect(data).toEqual("C");
  });
});
