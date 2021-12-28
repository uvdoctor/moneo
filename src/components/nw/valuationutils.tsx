import { addYears, differenceInCalendarYears, differenceInMonths } from 'date-fns';
import { AssetType, CreateNPSPriceInput, HoldingInput, PropertyInput } from '../../api/goals';
import { getCompoundedIncome, getNPV } from '../calc/finance';
import { getCommodityRate, getCryptoRate } from './nwutils';
const today = new Date();
const presentMonth = today.getMonth() + 1;
const presentYear = today.getFullYear();

export const getCashFlows = (
	amt: number,
	durationEnded: number,
	durationLeft: number,
	rate: number,
	isMonth: boolean
) => {
	let cashflows: any = [];
	let count = 0;
	let monthLeftForCurrentYear = 0;
	if (isMonth) {
		if (durationEnded > 0) {
			monthLeftForCurrentYear = 12 - today.getMonth();
			amt = getCompoundedIncome(rate, amt, (monthLeftForCurrentYear + durationEnded) / 12, 12);
			const cfs = Array(Math.round(monthLeftForCurrentYear)).fill(amt);
			cashflows = cashflows.concat(cfs);
		}
		for (let index = 0; index <= durationLeft - monthLeftForCurrentYear; index++) {
			count++;
			if (count === 12) {
				amt = getCompoundedIncome(rate as number, amt, 1, 12);
				const cfs = Array(Math.round(12)).fill(amt);
				cashflows = cashflows.concat(cfs);
				count = 0;
			}
		}
		if (count < 12 && count > 0) {
			amt = getCompoundedIncome(rate as number, amt, 1, 12);
			const cfs = Array(Math.round(count)).fill(amt);
			cashflows = cashflows.concat(cfs);
		}
	} else {
		if (durationEnded > 0) {
			amt = getCompoundedIncome(rate, amt, durationEnded, 1);
		}
		for (let index = 0; index <= durationLeft; index++) {
			amt = getCompoundedIncome(rate as number, amt, 1, 1);
			const cfs = Array(Math.round(1)).fill(amt);
			cashflows = cashflows.concat(cfs);
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

export const calculateNPVAmt = (holding: HoldingInput) => {
	let cashflows: any = [];
	let isMonth = holding.chgF === 1 ? false : true;
	const calc = isMonth ? calculateDifferenceInMonths : calculateDifferenceInYears;
	const durationFromStartToEnd = calc(
		holding.em as number,
		holding.ey as number,
		holding.sm as number,
		holding.sy as number
	);
	const durationLeft = calc(holding.em as number, holding.ey as number, presentMonth, presentYear);
	if (durationLeft <= 0 || isNaN(durationLeft)) return 0;
	let durationEnded = (durationLeft > durationFromStartToEnd ? 0 : durationFromStartToEnd) - durationLeft;
	if (holding.subt && holding.subt !== 'L') {
		cashflows = getCashFlows(
			holding.amt as number,
			durationEnded,
			durationLeft > durationFromStartToEnd ? durationFromStartToEnd : durationLeft,
			holding.chg as number,
			isMonth
		);
	} else {
		cashflows = Array(Math.round(durationLeft)).fill(holding.amt);
	}
	const npv = getNPV(10, cashflows, 0, isMonth ? true : false, durationLeft > durationFromStartToEnd ? false : true);
	return npv;
};

export const calculateCompundingIncome = (holding: HoldingInput) => {
	const duration = calculateDifferenceInYears(holding.em as number, holding.ey as number, presentMonth, presentYear);
	if (duration < 0) return 0;
	if (!holding.chgF) return holding.amt as number;
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
