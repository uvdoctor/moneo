const utility = require("../lib/nodejs/utility");

describe("Test Date, Month, Year, MonthChar and Fullyear", () => {
  test("Today date without passing any parameter", () => {
    const data = utility();
    expect(data).toEqual({
      date: 21,
      month: "09",
      monthChar: "SEP",
      year: "21",
      yearFull: 2021,
    });
  });
  test("Today date with passing parameter", () => {
    const data = utility(0);
    expect(data).toEqual({
      date: 21,
      month: "09",
      monthChar: "SEP",
      year: "21",
      yearFull: 2021,
    });
  });
  test("Subtracting Days from todayDate to get previous Days data", () => {
    const data = utility(2);
    expect(data).toEqual({
      date: 19,
      month: "09",
      monthChar: "SEP",
      year: "21",
      yearFull: 2021,
    });
  });
});