// const calc = require("../src/calculate");

// describe("Test Asset Type", () => {
//   test("Fixed in Case of ETF - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "B", "NETFNIF100");
//     expect(data).toEqual("F");
//   });
//   test("Fixed in Case of Gold - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "E", "AXISGOLD");
//     expect(data).toEqual("F");
//   });
//   test("Alternative - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "IF", "INDIGRID");
//     expect(data).toEqual("A");
//   });
//   test("Equity - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "A", "KOTAK MAH.BK");
//     expect(data).toEqual("E");
//   });
// });

// describe("Test Asset Subtype", () => {
//   test("Liquid - BSE", () => {
//     const data = calc["BSE"].calcSubType("Q", "F", "LIQUIDBEES");
//     expect(data).toEqual("L");
//   });
//   test("Index - BSE", () => {
//     const data = calc["BSE"].calcSubType("Q", "B", "LICNETFSEN");
//     expect(data).toEqual("I");
//   });
//   test("Other Gov. Bond - BSE", () => {
//     const data = calc["BSE"].calcSubType("Q", "F", "ABDBSPDG");
//     expect(data).toEqual("GBO");
//   });
//   test("Gold Bond - BSE", () => {
//     const data = calc["BSE"].calcSubType("B", "G", "SGBFEB27");
//     expect(data).toEqual("GoldB");
//   });
// });

// // describe("Test Asset InsType", () => {
// //   test("ETF - BSE", () => {
// //     const data = calc["BSE"].calcInsType("Q", "E", "IDBIGOLD");
// //     expect(data).toEqual("ETF");
// //   });
// //   test("REIT - BSE", () => {
// //     const data = calc["BSE"].calcInsType("Q", "IF", "MINDSPACE");
// //     expect(data).toEqual("REIT");
// //   });
// //   test("InvIT - BSE", () => {
// //     const data = calc["BSE"].calcInsType("Q", "IF", "INDIGRID");
// //     expect(data).toEqual("InvIT");
// //   });
// //   test("ETF - NSE", () => {
// //     const data = calc["NSE"].calcInsType("EQ", "", "AXISTECETF");
// //     expect(data).toEqual("ETF");
// //   });
// //   test("REIT - NSE", () => {
// //     const data = calc["NSE"].calcInsType("RR", "", "BIRET");
// //     expect(data).toEqual("REIT");
// //   });
// //   test("InvIT - NSE", () => {
// //     const data = calc["NSE"].calcInsType("IV", "", "IRBINVIT");
// //     expect(data).toEqual("InvIT");
// //   });
// // });
