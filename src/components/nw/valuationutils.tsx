import { addYears, differenceInCalendarYears, differenceInMonths } from "date-fns";
import { getCompoundedIncome } from "../calc/finance";

export const getCashFlows = (
	amt: number,
	durationEnded: number,
	cashflows: any,
	durationLeft: number,
	rate: number,
	isMonth: boolean
) => {
	const today = new Date();
	let count = 0;
	let time = 0;
	let monthLeftForCY = 0;
	if (isMonth) {
		if (durationEnded > 0) {
			monthLeftForCY = 12 - today.getMonth();
			amt = getCompoundedIncome(rate, amt, (monthLeftForCY + durationEnded) / 12, 12);
			const cfs = Array(Math.round(monthLeftForCY)).fill(amt);
			time = durationEnded + monthLeftForCY;
			cashflows = cashflows.concat(cfs);
		}
		for (let index = 0; index <= durationLeft - monthLeftForCY; index++) {
			count++;
			if (count === 12) {
				time += count;
				amt = getCompoundedIncome(rate as number, amt, time / 12, 12);
				const cfs = Array(Math.round(12)).fill(amt);
				cashflows = cashflows.concat(cfs);
				count = 0;
			}
		}
		if (count < 12 && count > 0) {
			time += count;
			amt = getCompoundedIncome(rate as number, amt, time / 12, 12);
			const cfs = Array(Math.round(count)).fill(amt);
			cashflows = cashflows.concat(cfs);
		}
	} else {
		if (durationEnded > 0) {
			amt = getCompoundedIncome(rate, amt, durationEnded, 1);
      time += durationEnded;
		}
		for (let index = 0; index <= durationLeft; index++) {
			time += 1;
			amt = getCompoundedIncome(rate as number, amt, time, 1);
			const cfs = Array(Math.round(1)).fill(amt);
			cashflows = cashflows.concat(cfs);
		}
	}
	return cashflows;
};

export const calculateDifferenceInYears = (em: number, ey: number, sm: number, sy: number) => {
  return differenceInCalendarYears(new Date(ey, em-1, 30), new Date(sy, sm-1, 1));
}

export const calculateDifferenceInMonths = (em: number, ey: number, sm: number, sy: number) => {
  return differenceInMonths(new Date(ey, em-1, 30), new Date(sy, sm-1, 1));
}

export const calculateAddYears = (mon: number, yr: number, yearsToAdd: number) => {
  const result = addYears(new Date(yr, mon, 1), yearsToAdd)
  const year = result.getFullYear();
  const month = result.getMonth();
  return {year, month}
}

