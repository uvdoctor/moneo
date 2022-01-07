import { addYears, differenceInCalendarYears, differenceInMonths } from 'date-fns';
import { AssetType, CreateNPSPriceInput, HoldingInput, PropertyInput } from '../../api/goals';
import { getCompoundedIncome, getNPV } from '../calc/finance';
import { getCommodityRate, getCryptoRate } from './nwutils';
const today = new Date();
const presentMonth = today.getMonth() + 1;
const presentYear = today.getFullYear();

export const getCashFlows = (
	amt: number,
	bygoneDuration: number,
	remainingDuration: number,
	rate: number,
	isMonth: boolean
) => {
	let cashflows: any = [];
	let count = 0;
	let monthLeftForCurrentYear = 12 - today.getMonth();
	let bygoneTimeToCalculateForCI = isMonth ? (monthLeftForCurrentYear + bygoneDuration) / 12 : bygoneDuration;
	if (bygoneDuration > 0) {
		amt = getCompoundedIncome(rate, amt, bygoneTimeToCalculateForCI, isMonth ? 12 : 1);
		if (isMonth && monthLeftForCurrentYear > 0) {
			cashflows = Array(Math.round(monthLeftForCurrentYear)).fill(amt);
		}
	}
	if (isMonth) {
		for (let index = 0; index <= remainingDuration - monthLeftForCurrentYear; index++) {
			count++;
			if (count === 12) {
				amt = getCompoundedIncome(rate as number, amt, 1, 12);
				cashflows = [ ...cashflows, ...Array(Math.round(12)).fill(amt) ];
				count = 0;
			}
		}
		if (count < 12 && count > 0) {
			amt = getCompoundedIncome(rate as number, amt, count / 12, 12);
			cashflows = [ ...cashflows, ...Array(Math.round(count)).fill(amt) ];
		}
	} else {
		for (let index = 0; index <= remainingDuration; index++) {
			amt = getCompoundedIncome(rate as number, amt, 1, 1);
			cashflows = Array(Math.round(1)).fill(amt);
		}
	}
	return cashflows;
};

export const calculateDifferenceInYears = (em: number, ey: number, sm: number, sy: number) => {
	return differenceInCalendarYears(new Date(ey, em - 1, 30), new Date(sy, sm - 1, 1));
};

export const calculateDifferenceInMonths = (em: number, ey: number, sm: number, sy: number) => {
	return differenceInMonths(new Date(ey, em - 1, 30), new Date(sy, sm - 1, 1));
};

export const calculateAddYears = (mon: number, yr: number, yearsToAdd: number) => {
	const result = addYears(new Date(yr, mon, 1), yearsToAdd);
	const year = result.getFullYear();
	const month = result.getMonth();
	return { year, month };
};

export const calculatePM = (holding: HoldingInput, ratesData: any, selectedCurrency: string) => {
	const rate = getCommodityRate(ratesData, holding.subt as string, holding.name as string, selectedCurrency);
	return holding.qty * rate;
};

export const calculateInsurance = (holding: HoldingInput, discountRate: number, le: number, dob: string) => {
	let { sm, sy, em, ey, amt, chg, subt } = holding;
	let [ durationFromStartToEnd, remainingDuration ] = [ 0, 0 ];
	let cashflows: Array<number> = [];
	let isMonth: boolean = holding.chgF === 1 ? false : true;
	const calc = isMonth ? calculateDifferenceInMonths : calculateDifferenceInYears;

	if (subt === 'H' && dob && le) {
		const birthYear = Number(dob.slice(0, dob.indexOf('-')));
		const birthMonth = Number(dob.slice(dob.indexOf('-') + 2, dob.lastIndexOf('-')));
		const { year, month } = calculateAddYears(birthMonth, birthYear, le); //lifeExpectancy year and month
		durationFromStartToEnd = calc(month, year, sm as number, sy as number);
		remainingDuration = calc(month, year, presentMonth, presentYear);
	} else {
		durationFromStartToEnd = calc(em as number, ey as number, sm as number, sy as number);
		remainingDuration = calc(em as number, ey as number, presentMonth, presentYear);
	}

	if (remainingDuration <= 0 || isNaN(remainingDuration)) return 0;
	let bygoneDuration = durationFromStartToEnd - remainingDuration;
	
	if (subt && subt !== 'L') {
		cashflows = getCashFlows(amt as number, bygoneDuration, remainingDuration, chg as number, isMonth);
	} else {
		cashflows = Array(Math.round(remainingDuration)).fill(amt);
	}
	const npv = getNPV(discountRate, cashflows, 0, isMonth ? true : false, true);
	return npv;
};

export const calculateLoan = (holding: HoldingInput) => {
	const remainingDuration = calculateDifferenceInMonths(
		holding.em as number,
		holding.ey as number,
		presentMonth,
		presentYear
	);
	const cashflows = Array(Math.round(remainingDuration)).fill(holding.amt);
	const npv = getNPV(holding.chg as number, cashflows, 0, true, true);
	return npv;
};

export const calculateCompundingIncome = (holding: HoldingInput) => {
	const remainingDuration = calculateDifferenceInYears(
		holding.em as number,
		holding.ey as number,
		presentMonth,
		presentYear
	);
	if (remainingDuration < 0) return 0;
	if (!holding.chgF) return holding.amt as number;
	const duration = calculateDifferenceInYears(presentMonth, presentYear, holding.sm as number, holding.sy as number);
	return getCompoundedIncome(holding.chg as number, holding.amt as number, duration, holding.chgF);
};

export const calculateProperty = (property: PropertyInput) => {
	const duration = calculateDifferenceInYears(
		presentMonth,
		presentYear,
		property.mvm as number,
		property.mvy as number
	);
	if (duration < 0) return property.mv as number;
	return getCompoundedIncome(property.rate, property.mv as number, duration);
};

export const calculateVehicle = (holding: HoldingInput) => {
	const duration = calculateDifferenceInYears(presentMonth, presentYear, holding.sm as number, holding.sy as number);
	if (duration < 0) return 0;
	return getCompoundedIncome(-(holding.chg as number), holding.amt as number, duration);
};

export const calculateCrypto = (holding: HoldingInput, ratesData: any, selectedCurrency: string) => {
	const rate = getCryptoRate(ratesData, holding.name as string, selectedCurrency);
	return holding.qty * rate;
};

export const calculateProvidentFund = (holding: HoldingInput) => {
	let value = holding.amt as number;
	if (presentMonth === 4) {
		const duration = calculateDifferenceInYears(
			presentMonth,
			presentYear,
			holding.sm as number,
			holding.sy as number
		);
		if (duration <= 0) return (value + holding.qty) as number;
		for (let i = 0; i < duration; i++) {
			value += holding.qty as number;
			value += value + value * ((holding.chg as number) / 100);
		}
		return value;
	} else {
		return (value + holding.qty) as number;
	}
};

export const calculateNPS = (holding: HoldingInput, npsData: Array<CreateNPSPriceInput>) => {
	let fixed = 0;
	let equity = 0;
	let value = 0;
	const data = npsData.find((item) => item.id === holding.name);
	if (!data) return { value, fixed, equity };
	value = holding.qty * data.price;
	if (data.type === AssetType.E) equity += value;
	else if (data.type === AssetType.F) fixed += value;
	else if (data.type === AssetType.H) {
		fixed += 0.8 * value;
		equity += 0.2 * value;
	}
	return { value, fixed, equity };
};
