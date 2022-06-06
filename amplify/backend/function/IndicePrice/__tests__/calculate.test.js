const { calcInd, calcType, calcSubType } = require("../src/calculate");

describe("Test Asset Type", () => {
  test("Equity", () => {
    const data = calcType("Nifty Energy");
    expect(data).toEqual("E");
  });
  test("Fixed", () => {
    const data = calcType("Nifty 4-8 yr G-Sec Index");
    expect(data).toEqual("F");
  });
});

describe("Test Asset Subtype", () => {
  test("Stock", () => {
    const data = calcSubType("NIFTY500 Value 50");
    expect(data).toEqual("S");
  });
  test("Gov. Bond", () => {
    const data = calcSubType("Nifty 8-13 yr G-Sec");
    expect(data).toEqual("GB");
  });
});

describe("Test Industry", () => {
  test("Basic Materials", () => {
    const data = calcInd("S&P BSE Basic Materials");
    expect(data).toEqual("BASM");
  });
  test("Consumer Durables", () => {
    const data = calcInd("Nifty Consumer Durables");
    expect(data).toEqual("CD");
  });
  test("Energy", () => {
    const data = calcInd("Nifty Energy");
    expect(data).toEqual("E");
  });
  test("Fast Moving Consumer Goods", () => {
    const data = calcInd("S&P BSE Fast Moving Consumer Goods");
    expect(data).toEqual("CG");
  });
  test("Finance", () => {
    const data = calcInd("Nifty Financial Services");
    expect(data).toEqual("F");
  });
  test("HealthCare", () => {
    const data = calcInd("S&P BSE Healthcare");
    expect(data).toEqual("H");
  });
  test("Pharma", () => {
    const data = calcInd("Nifty Pharma");
    expect(data).toEqual("PH");
  });
  test("Industrials", () => {
    const data = calcInd("S&P BSE Industrials");
    expect(data).toEqual("I");
  });
  test("Information Technology", () => {
    const data = calcInd("Nifty IT");
    expect(data).toEqual("IT");
  });
  test("Telecom", () => {
    const data = calcInd("S&P BSE Telecom");
    expect(data).toEqual("TC");
  });
  test("Utilities", () => {
    const data = calcInd("S&P BSE Utilities");
    expect(data).toEqual("U");
  });
  test("Auto", () => {
    const data = calcInd("S&P BSE AUTO");
    expect(data).toEqual("A");
  });
  test("Bank", () => {
    const data = calcInd("Nifty Bank");
    expect(data).toEqual("F");
  });
  test("Capital Goods", () => {
    const data = calcInd("S&P BSE CAPITAL GOODS");
    expect(data).toEqual("CAPG");
  });
  test("Consumer Discretionary Goods & Services", () => {
    const data = calcInd("S&P BSE Consumer Discretionary Goods & Services");
    expect(data).toEqual("CDGS");
  });
  test("Metal", () => {
    const data = calcInd("S&P BSE METAL");
    expect(data).toEqual("MET");
  });
  test("Media", () => {
    const data = calcInd("Nifty Media");
    expect(data).toEqual("MED");
  });
  test("PSU Bank", () => {
    const data = calcInd("Nifty PSU Bank");
    expect(data).toEqual("F");
  });
  test("Private Bank", () => {
    const data = calcInd("Nifty Private Bank");
    expect(data).toEqual("F");
  });
  test("Oil and Gas", () => {
    const data = calcInd("S&P BSE OIL & GAS");
    expect(data).toEqual("OG");
  });
  test("Power", () => {
    const data = calcInd("S&P BSE POWER");
    expect(data).toEqual("POW");
  });
  test("Realty", () => {
    const data = calcInd("S&P BSE REALTY");
    expect(data).toEqual("C");
  });
  test("Technology", () => {
    const data = calcInd("S&P BSE TECK");
    expect(data).toEqual("TECH");
  });
});