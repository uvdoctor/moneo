import { addYears, differenceInCalendarYears, differenceInMonths } from 'date-fns';
import simpleStorage from 'simplestorage.js';
import {
	AssetSubType,
	AssetType,
	CreateNPSPriceInput,
	HoldingInput,
	InstrumentInput,
	InsType,
	MFSchemeType,
	PropertyInput,
	PropertyType
} from '../../api/goals';
import { LOCAL_INS_DATA_KEY } from '../../CONSTANTS';
import { getCompoundedIncome, getNPV } from '../calc/finance';
import { includesAny } from '../utils';
import {
	doesHoldingMatch,
	doesMemberMatch,
	doesPropertyMatch,
	getCommodityRate,
	getCryptoRate,
	isFund,
	isLargeCap
} from './nwutils';
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
	let monthLeftForCurrentYear = 12 - presentMonth;
	let bygoneTimeToCalculateForCI = isMonth ? (monthLeftForCurrentYear + bygoneDuration) / 12 : bygoneDuration;
	if (bygoneDuration >= 0) {
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
			cashflows = cashflows.concat(Array(Math.round(1)).fill(amt));
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
	const result = addYears(new Date(yr, mon - 1, 1), yearsToAdd);
	const year = result.getFullYear();
	const month = result.getMonth() + 1;
	return { year, month };
};

export const calculateInsurance = (holding: HoldingInput, discountRate: number, le: number, dob: string) => {
	let { sm, sy, em, ey, amt, chg, subt } = holding;
	let [ durationFromStartToEnd, remainingDuration ] = [ 0, 0 ];
	let cashflows: Array<number> = [];
	let isMonth: boolean = holding.chgF === 1 ? false : true;
	const calc = isMonth ? calculateDifferenceInMonths : calculateDifferenceInYears;

	if (subt === 'H' && dob && le) {
		const birthdate: Date = new Date(dob);
		const { year, month } = calculateAddYears(birthdate.getMonth() + 1, birthdate.getFullYear(), le); //lifeExpectancy year and month
		durationFromStartToEnd = calc(month, year, sm as number, sy as number);
		remainingDuration = calc(month, year, presentMonth, presentYear);
	} else {
		durationFromStartToEnd = calc(em as number, ey as number, sm as number, sy as number);
		remainingDuration = calc(em as number, ey as number, presentMonth, presentYear);
	}

	if (remainingDuration < 0 || isNaN(remainingDuration)) return 0;
	if (remainingDuration === 0) return amt as number;
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
	if (remainingDuration < 0 || isNaN(remainingDuration)) return 0;
	if (remainingDuration === 0) return holding.amt as number;
	const cashflows = Array(Math.round(remainingDuration)).fill(holding.amt);
	const npv = getNPV(holding.chg as number, cashflows, 0, true, true);
	return npv;
};

export const calculateCompundingIncome = (holding: HoldingInput) => {
	let [valuation, maturityAmt, isShortTerm] = [0, 0, true];
	const remainingDuration = calculateDifferenceInYears(
		holding.em as number,
		holding.ey as number,
		presentMonth,
		presentYear
	);
	if (remainingDuration < 0) return { valuation, maturityAmt };	
	if(remainingDuration >= 1) isShortTerm = false;
	if (!holding.chgF)
		return {
			valuation: holding.amt as number,
			maturityAmt: holding.amt as number
		};
	const duration = calculateDifferenceInYears(presentMonth, presentYear, holding.sm as number, holding.sy as number);
	const durationFromStartToEnd = calculateDifferenceInYears(
		holding.em as number,
		holding.ey as number,
		holding.sm as number,
		holding.sy as number
	);
	valuation = getCompoundedIncome(holding.chg as number, holding.amt as number, duration, holding.chgF);
	maturityAmt = getCompoundedIncome(
		holding.chg as number,
		holding.amt as number,
		durationFromStartToEnd,
		holding.chgF
	);
	return { valuation, maturityAmt, isShortTerm };
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

export const calculateCrypto = (holding: HoldingInput, selectedCurrency: string) => {
	return getCryptoRate(holding.name as string, selectedCurrency).then((rate) => holding.qty * rate).catch(() => 0);
};

export const calculatePM = (holding: HoldingInput, selectedCurrency: string, fxRates: any) => {
	return getCommodityRate(holding.subt as string, holding.name as string, selectedCurrency, fxRates)
		.then((rate) => holding.qty * rate)
		.catch(() => 0);
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
		if (duration <= 0) return value;
		for (let i = 0; i < duration; i++) {
			value += holding.qty as number;
			value += value + value * ((holding.chg as number) / 100);
		}
	}
	return value;
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

export const priceInstruments = (
	instruments: Array<InstrumentInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	let total = 0;
	let totalFGold = 0;
	let totalFRE = 0;
	let totalInv = 0;
	let totalFFixed = 0;
	let totalFEquity = 0;
	let totalBonds = 0;
	let totalStocks = 0;
	let totalMFs = 0;
	let totalETFs = 0;
	let largeCapStocks = 0;
	let largeCapFunds = 0;
	let largeCapETFs = 0;
	let multiCap = 0;
	let fmp = 0;
	let intervalFunds = 0;
	let indexFunds = 0;
	let liquidFunds = 0;
	let cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
	instruments.forEach((instrument: InstrumentInput) => {
		const id = instrument.id;
		const data = cachedData[id];
		if (data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
			let value = instrument.qty * data.price;
			total += value;
			if (data.itype === InsType.ETF) totalETFs += value;
			else if (isFund(instrument.id)) totalMFs += value;
			if (data.subt === AssetSubType.GoldB) totalFGold += value;
			else if (data.itype && data.itype === InsType.REIT) totalFRE += value;
			else if (data.itype && data.itype === InsType.InvIT) totalInv += value;
			else if (data.type === AssetType.E) {
				totalFEquity += value;
				if (isLargeCap(data)) {
					if (data.itype === InsType.ETF) largeCapETFs += value;
					else isFund(instrument.id) ? (largeCapFunds += value) : (largeCapStocks += value);
				} else multiCap += value;
				if (!isFund(id) && !data.itype) totalStocks += value;
			} else if (data.type === AssetType.F) {
				totalFFixed += value;
				if (data.subt === AssetSubType.I) indexFunds += value;
				else if (data.subt === AssetSubType.L) liquidFunds += value;
				else if (data.mftype && data.subt === AssetSubType.HB) {
					if (data.mftype === MFSchemeType.I) intervalFunds += value;
					if (data.mftype === MFSchemeType.C) fmp += value;
				} else totalBonds += value;
			} else if (data.type === AssetType.H) {
				if (includesAny(data.name as string, [ 'conservative' ])) {
					totalFFixed += 0.7 * value;
					totalFEquity += 0.3 * value;
					multiCap += 0.3 * value;
				} else if (includesAny(data.name as string, [ 'multi-asset' ])) {
					totalFGold += 0.1 * value;
					totalFEquity += 0.6 * value;
					totalFFixed += 0.3 * value;
					multiCap += 0.6 * value;
					totalBonds += 0.3 * value;
				} else if (includesAny(data.name as string, [ 'balanced' ])) {
					totalFEquity += 0.6 * value;
					totalFFixed += 0.4 * value;
					multiCap += 0.6 * value;
					totalBonds += 0.4 * value;
				} else {
					totalFFixed += 0.7 * value;
					totalFEquity += 0.3 * value;
					multiCap += 0.3 * value;
					totalBonds += 0.7 * value;
				}
			}
		}
	});
	return {
		total,
		totalFGold,
		totalFEquity,
		totalFRE,
		totalFFixed,
		totalInv,
		totalStocks,
		totalBonds,
		totalETFs,
		totalMFs,
		largeCapStocks,
		largeCapFunds,
		largeCapETFs,
		multiCap,
		indexFunds,
		fmp,
		intervalFunds,
		liquidFunds
	};
};

export const pricePM = async (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string,
	fxRates: any
) => {
	let total = 0;
	let totalPGold = 0;
	for (let holding of holdings) {
		if (doesMemberMatch(holding, selectedMembers)) {
			const rate = await calculatePM(holding, selectedCurrency, fxRates);
			total += rate;
			if (holding.subt === AssetSubType.Gold) totalPGold += rate;
		}
	}
	return { total, totalPGold };
};

export const priceInsurance = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string,
	discountRate: number,
	userInfo: any
) => {
	let total = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && discountRate && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			total += calculateInsurance(
				holding,
				discountRate,
				userInfo?.le,
				userInfo?.dob
			);
		}
	});
	return total;
};

export const priceLoans = (holdings: Array<HoldingInput>, selectedMembers: Array<string>, selectedCurrency: string) => {
	let total = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			total += calculateLoan(holding);
		}
	});
	return total;
};

export const priceLendings = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	let total = 0;
	let totalShortTerm = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			const { valuation, isShortTerm } = calculateCompundingIncome(holding); 
			total += valuation;
			if(isShortTerm) totalShortTerm += valuation;
		}
	});
	return { total, totalShortTerm};
};

export const priceLtdep = (holdings: Array<HoldingInput>, selectedMembers: Array<string>, selectedCurrency: string) => {
	let total = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			total += calculateCompundingIncome(holding).valuation;
		}
	});
	return total;
};

export const priceP2P = (holdings: Array<HoldingInput>, selectedMembers: Array<string>, selectedCurrency: string) => {
	let total = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			total += calculateCompundingIncome(holding).valuation;
		}
	});
	return total;
};

const calculateBalance = (holdings: Array<HoldingInput>, selectedMembers: Array<string>, selectedCurrency: string) => {
	let total = 0;
	holdings.forEach((record: HoldingInput) => {
		if (record && doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
			total += record.amt as number;
		}
	});
	return total;
};

export const priceCredit = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	return calculateBalance(holdings, selectedMembers, selectedCurrency);
};

export const priceSavings = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	return calculateBalance(holdings, selectedMembers, selectedCurrency);
};

export const priceOthers = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	return calculateBalance(holdings, selectedMembers, selectedCurrency);
};

export const priceAngel = (holdings: Array<HoldingInput>, selectedMembers: Array<string>, selectedCurrency: string) => {
	return calculateBalance(holdings, selectedMembers, selectedCurrency);
};

export const priceProperties = (
	properties: Array<PropertyInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	let total = 0;
	let totalOtherProperty = 0;
	let totalCommercial = 0;
	let totalResidential = 0;
	let totalPlot = 0;
	properties.forEach((property: PropertyInput) => {
		if (!doesPropertyMatch(property, selectedMembers, selectedCurrency)) return;
		const value = calculateProperty(property);
		total += value;
		if (property.type === PropertyType.P) totalPlot += value;
		if (property.type === PropertyType.OTHER) totalOtherProperty += value;
		if (
			property.type === PropertyType.A ||
			property.type === PropertyType.H ||
			property.type === PropertyType.C ||
			property.type === PropertyType.T
		)
			totalResidential += value;
		if (property.type === PropertyType.COMM) totalCommercial += value;
	});
	return { total, totalOtherProperty, totalCommercial, totalResidential, totalPlot };
};

export const priceVehicles = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	let total = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			total += calculateVehicle(holding);
		}
	});
	return total;
};

export const priceCrypto = async (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	let total = 0;
	for (let holding of holdings) {
		if (doesMemberMatch(holding, selectedMembers)) {
			total += await calculateCrypto(holding, selectedCurrency);
		}
	}
	return total;
};

export const pricePF = (holdings: Array<HoldingInput>, selectedMembers: Array<string>, selectedCurrency: string) => {
	let total = 0;
	let totalPPF = 0;
	let totalVPF = 0;
	let totalEPF = 0;
	holdings.forEach((record: HoldingInput) => {
		if (doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
			const value = calculateProvidentFund(record);
			total += value;
			if (record.subt === 'PF') totalPPF += value;
			if (record.subt === 'VF') totalVPF += value;
			if (record.subt === 'EF') totalEPF += value;
		}
	});
	return { total, totalPPF, totalVPF, totalEPF };
};

export const priceNPS = (
	holdings: Array<HoldingInput>,
	selectedMembers: Array<string>,
	selectedCurrency: string,
	npsData: any
) => {
	let total = 0;
	let totalNPSFixed = 0;
	let totalNPSEquity = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			const { value, fixed, equity } = calculateNPS(holding, npsData);
			total += value;
			totalNPSFixed += fixed;
			totalNPSEquity += equity;
		}
	});
	return { total, totalNPSFixed, totalNPSEquity };
};