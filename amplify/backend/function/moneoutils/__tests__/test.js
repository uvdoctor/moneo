const{utility }= require('../lib/nodejs/utility');
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
const today = new Date();
const monthChar = monthsArray[today.getMonth()];
const date = today.getDate();
const month = today.getMonth();
const yearFull = today.getFullYear();
const year = yearFull.toString().substr(-2);

describe('Test Date, Month, Year, MonthChar and Fullyear', () => {
	test('Today date without passing any parameter', () => {
		const data = utility();
		expect(data).toEqual({
			date: date,
			month: (month+1).toString(),
			monthChar: monthChar,
			year: year,
			yearFull: yearFull
		});
	});
	test('Today date with passing parameter', () => {
		const data = utility(0);
		expect(data).toEqual({
      date: date,
			month: (month+1).toString(),
			monthChar: monthChar,
			year: year,
			yearFull: yearFull
		});
	});
	test('Subtracting Days from todayDate to get previous Days data', () => {
		const data = utility(1);
		expect(data).toEqual({
			date: date-1,
			month: (month+1).toString(),
			monthChar: monthChar,
			year: year,
			yearFull: yearFull
		});
	});
});
