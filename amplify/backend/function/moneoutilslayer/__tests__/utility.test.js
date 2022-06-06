const {
  utility,
  divideArrayBySize,
  awsdate,
  toCurrency,
  toHumanFriendlyCurrency,
} = require("../lib/nodejs/utility");

const monthsArray = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const getStr = (num) => (num < 10 ? `0${num}` : "" + num);
const today = new Date();
const monthChar = monthsArray[today.getMonth()];
const date = getStr(today.getDate());
const month = getStr(today.getMonth() + 1);
const yearFull = today.getFullYear();
const year = yearFull.toString().substr(-2);

describe("Test Date, Month, Year, MonthChar and Fullyear", () => {
  test("Today date without passing any parameter", () => {
    const data = utility();
    expect(data.date).toEqual(date);
    expect(data.month).toEqual(month);
    expect(data.monthChar).toEqual(monthChar);
    expect(data.year).toEqual(year);
    expect(data.yearFull).toEqual(yearFull);
  });
  test("Today date with passing parameter", () => {
    const data = utility(0);
    expect(data.date).toEqual(date);
    expect(data.month).toEqual(month);
    expect(data.monthChar).toEqual(monthChar);
    expect(data.year).toEqual(year);
    expect(data.yearFull).toEqual(yearFull);
  });
  test("Subtracting Days from todayDate to get previous Days data", () => {
    const data = utility(1);
    expect(data.date).toEqual(getStr(date - 1));
    expect(data.month).toEqual(month);
    expect(data.monthChar).toEqual(monthChar);
    expect(data.year).toEqual(year);
    expect(data.yearFull).toEqual(yearFull);
  });
});

const array = [11, 10, 12, 12, 45, 45, 50, 80, 12];
describe("Test Divide array by size", () => {
  test("Divide array into length of 4", () => {
    const data = divideArrayBySize(array, 4);
    expect(data).toEqual([[11, 10, 12, 12], [45, 45, 50, 80], [12]]);
  });
  test("Empty array", () => {
    const data = divideArrayBySize([], 2);
    expect(data).toEqual([[]]);
  });
  test("Size greater then length", () => {
    const data = divideArrayBySize(array, 9);
    expect(data).toEqual([[11, 10, 12, 12, 45, 45, 50, 80, 12]]);
  });
});

describe("Test Awsdate", () => {
  test("Without parameter", () => {
    expect(awsdate()).toEqual(null);
  });
  test("Inaccurate parameter", () => {
    expect(awsdate("awsdate")).toEqual(null);
  });
  test("Accurate Parameter", () => {
    expect(awsdate("02-Jul-2021")).toEqual("2021-07-02");
  });
});

describe("Test To Currency", () => {
  test("With decimal", () => {
    expect(toCurrency(100, "INR", true)).toEqual("₹100.00");
  });
  test("Without decimal", () => {
    expect(toCurrency(100, "INR", false)).toEqual("₹100");
  });
  test("Different Currency", () => {
    expect(toCurrency(100, "USD", false)).toEqual("$100");
  });
});

describe("Test HumanFriendlyCurrency", () => {
  test("With decimal", () => {
    expect(toHumanFriendlyCurrency(100, "INR")).toEqual("₹100");
  });
  test("Different Currency", () => {
    expect(toHumanFriendlyCurrency(100, "USD")).toEqual("$100");
  });
});
