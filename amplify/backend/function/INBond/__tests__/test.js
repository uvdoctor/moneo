const { calcSchema, calc, calcYTM } = require("../src/calculate");

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
  test("Start Month", () => {
    const data = calc.calcSM("09-Mar-20");
    expect(data).toEqual(3);
  });
  test("Start Year", () => {
    const data = calc.calcSY("06-May-21");
    expect(data).toEqual(21);
  });
});

describe("Calculate Maturity Period", () => {
  test("Maturity Month", () => {
    const data = calc.calcMM("06-May-28");
    expect(data).toEqual(5);
  });
  test("Maturity Year", () => {
    const data = calc.calcMY("06-May-24");
    expect(data).toEqual(24);
  });
});

describe("Check Floating Rate", () => {
  test("With Floating", () => {
    const data = calc.calcFR("RESET");
    expect(data).toEqual("Y");
  });
  test("Without Floating", () => {
    const data = calc.calcFR("7.45%");
    expect(data).toEqual("N");
  });
});

describe("Tax Free", () => {
  test("Tax Free Bond", () => {
    const data = calc.calcTF("IF");
    expect(data).toEqual("Y");
  });
  test("Tax Bond", () => {
    const data = calc.calcTF("AT");
    expect(data).toEqual("N");
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
    const data = calcYTM(
      {
        ISSUE_NAME: "RESET",
        ISSUE_DATE: "25-Feb-2014",
        MAT_DATE: "25-Feb-2024",
        "Last Traded Price (in Rs.)": "100.14",
      },
      {
        price: "Last Traded Price (in Rs.)",
        frate: "ISSUE_NAME",
        sDate: "ISSUE_DATE",
        mDate: "MAT_DATE",
        rate: "ISSUE_NAME",
      }
    );
    expect(data).toEqual(0);
  });
  test("Without Floating Rate", () => {
    const data = calcYTM(
      {
        ISSUE_NAME: "9.11%",
        ISSUE_DATE: "28-May-2014",
        MAT_DATE: "28-May-2024",
        "Last Traded Price (in Rs.)": "109.9989",
      },
      {
        price: "Last Traded Price (in Rs.)",
        frate: "ISSUE_NAME",
        sDate: "ISSUE_DATE",
        mDate: "MAT_DATE",
        rate: "ISSUE_NAME",
      }
    );
    expect(data).toEqual(0.077);
  });
});
