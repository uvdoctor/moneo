const { calc, calcSchema } = require("../src/calculate");

describe("Test Asset Type", () => {
  test("Fixed in Case of ETF - BSE", () => {
    const data = calc["BSE"].calcType("Q", "B", "NETFNIF100");
    expect(data).toEqual("F");
  });
  test("Fixed in Case of Gold - BSE", () => {
    const data = calc["BSE"].calcType("Q", "E", "AXISGOLD");
    expect(data).toEqual("F");
  });
  test("Alternative - BSE", () => {
    const data = calc["BSE"].calcType("Q", "IF", "INDIGRID");
    expect(data).toEqual("A");
  });
  test("Equity - BSE", () => {
    const data = calc["BSE"].calcType("Q", "A", "KOTAK MAH.BK");
    expect(data).toEqual("E");
  });
  test("Fixed in Case of Gold - NSE", () => {
    const data = calc["NSE"].calcType("EQ", "", "BSLGOLDETF");
    expect(data).toEqual("F");
  });
  test("Fixed in Case of Series - NSE", () => {
    const data = calc["NSE"].calcType("NN", "", "IRFC");
    expect(data).toEqual("F");
  });
  test("Alternative - NSE", () => {
    const data = calc["NSE"].calcType("RR", "", "EMBASSY");
    expect(data).toEqual("A");
  });
  test("Equity - NSE", () => {
    const data = calc["NSE"].calcType("EQ", "", "CADILAHC");
    expect(data).toEqual("E");
  });
});

describe("Test Asset Subtype", () => {
  test("Liquid - BSE", () => {
    const data = calc["BSE"].calcSubType("Q", "F", "LIQUIDBEES");
    expect(data).toEqual("L");
  });
  test("Index - BSE", () => {
    const data = calc["BSE"].calcSubType("Q", "B", "LICNETFSEN");
    expect(data).toEqual("I");
  });
  test("Other Gov. Bond - BSE", () => {
    const data = calc["BSE"].calcSubType("Q", "F", "ABDBSPDG");
    expect(data).toEqual("GBO");
  });
  test("Gold Bond - BSE", () => {
    const data = calc["BSE"].calcSubType("B", "G", "SGBFEB27");
    expect(data).toEqual("GoldB");
  });
  test("Corporate Bond - BSE", () => {
    const data = calc["BSE"].calcSubType("B", "F", "793REC22");
    expect(data).toEqual("CB");
  });
  test("Real Estate - BSE", () => {
    const data = calc["BSE"].calcSubType("Q", "IF", "MINDSPACE");
    expect(data).toEqual("R");
  });
  test("Stock - BSE", () => {
    const data = calc["BSE"].calcSubType("P", "F", "ZEE NCPS");
    expect(data).toEqual("S");
  });
  test("Liquid - NSE", () => {
    const data = calc["NSE"].calcSubType("EQ", "", "LIQUIDETF");
    expect(data).toEqual("L");
  });
  test("Index - NSE", () => {
    const data = calc["NSE"].calcSubType("EQ", "", "ICICINIFTY");
    expect(data).toEqual("I");
  });
  test("Other Gov. Bond - NSE", () => {
    const data = calc["NSE"].calcSubType("EQ", "", "EBBETF0430");
    expect(data).toEqual("GBO");
  });
  test("Gold Bond - NSE", () => {
    const data = calc["NSE"].calcSubType("GB", "", "SGBDEC2513");
    expect(data).toEqual("GoldB");
  });
  test("Corporate Bond - NSE", () => {
    const data = calc["NSE"].calcSubType("Z4", "", "SRTRANSFIN");
    expect(data).toEqual("CB");
  });
  test("Real Estate - NSE", () => {
    const data = calc["NSE"].calcSubType("IV", "", "PGINVIT");
    expect(data).toEqual("R");
  });
  test("Stock - NSE", () => {
    const data = calc["NSE"].calcSubType("EQ", "", "AARTIIND");
    expect(data).toEqual("S");
  });
  test("Gov Bond - NSE", () => {
    const data = calc["NSE"].calcSubType("EQ", "", "SETF10GILT");
    expect(data).toEqual("GB");
  });
  test("Gold - NSE", () => {
    const data = calc["NSE"].calcSubType("EQ", "", "SETFGOLD");
    expect(data).toEqual("Gold");
  });
});

describe("Test Asset InsType", () => {
  test("ETF - BSE", () => {
    const data = calc["BSE"].calcInsType("Q", "E", "IDBIGOLD");
    expect(data).toEqual("ETF");
  });
  test("REIT - BSE", () => {
    const data = calc["BSE"].calcInsType("Q", "IF", "MINDSPACE");
    expect(data).toEqual("REIT");
  });
  test("InvIT - BSE", () => {
    const data = calc["BSE"].calcInsType("Q", "IF", "INDIGRID");
    expect(data).toEqual("InvIT");
  });
  test("ETF - NSE", () => {
    const data = calc["NSE"].calcInsType("EQ", "", "AXISTECETF");
    expect(data).toEqual("ETF");
  });
  test("REIT - NSE", () => {
    const data = calc["NSE"].calcInsType("RR", "", "BIRET");
    expect(data).toEqual("REIT");
  });
  test("InvIT - NSE", () => {
    const data = calc["NSE"].calcInsType("IV", "", "IRBINVIT");
    expect(data).toEqual("InvIT");
  });
});
