import { TargetInput } from '../../api/goals';

export function getEmi(loanAmt: number, annualRate: number, months: number) {
	if (loanAmt <= 0 || annualRate < 0 || months <= 0) return 0;
	if (!annualRate) return loanAmt / months;
	let monthlyRate = annualRate / 1200;
	return loanAmt * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
}

//Tested
export function getCompoundedRate(rate: number, years: number, frequency: number = 1) {
	let r = rate ? rate : 0;
	let y = years ? years : 0;
	let f = frequency ? frequency : 1;
	return Math.pow(1 + r / (f * 100), f * y);
}
//Tested

export function getCompoundedIncome(rate: number, value: number, years: number, frequency: number = 1) {
	return value * getCompoundedRate(rate, years, frequency);
}
//Tested

export function getTotalInt(borrowAmt: number, emi: number, intRate: number, loanPaidForMonths: number) {
	let principal = borrowAmt;
	let monthlyRate = intRate / 1200;
	let totalInt = 0;
	for (let i = 0; i < loanPaidForMonths; i++) {
		let monthlyInt = principal * monthlyRate;
		totalInt += monthlyInt;
		principal -= emi - monthlyInt;
	}
	return totalInt;
}
//Tested

export function getIntAmtByYear(borrowAmt: number, emi: number, intRate: number, months: number) {
	let principal = borrowAmt;
	let annualInts = [];
	let monthlyRate = intRate / 1200;
	let annualInt = 0;
	let monthlyInt = 0;
	for (let i = 1; i <= months; i++) {
		monthlyInt = i === months ? emi - principal : principal * monthlyRate;
		annualInt += monthlyInt;
		if (i % 12 === 0 || i === months) {
			annualInts.push(annualInt);
			annualInt = 0;
		}
		principal -= emi - monthlyInt;
	}
	return annualInts;
}

export function getNPV(rr: number | Array<number>, cashFlows: Array<number>, startIndex: number) {
	let npv = 0;
	for (let i = cashFlows.length - 1; i > 0; i--) {
		let dr = typeof rr === 'number' ? rr : rr[startIndex + i];
		dr = dr >= 0 ? dr : 3;
		npv = (cashFlows[i] + npv) / (1 + dr / 100);
	}
	return Math.round(npv + cashFlows[0]);
}

export const findTarget = (loanPrepayments: Array<TargetInput>, installmentNum: number) =>
	loanPrepayments && loanPrepayments.length > 0
		? loanPrepayments.find((elem: TargetInput) => elem.num === installmentNum)
		: null;

export const createAmortizingLoanCFs = (
	loanBorrowAmt: number,
	loanIntRate: number,
	emi: number,
	loanPrepayments: Array<TargetInput>,
  loanIRAdjustments: Array<TargetInput>,
  loanMonthsAdjustments: Array<TargetInput>,
	loanMonths: number,
	duration: number
) => {
	let durationMonths = duration * 12;
	let loanDuration = loanMonths < durationMonths ? loanMonths : durationMonths;
	if (!loanBorrowAmt || !loanDuration || !emi)
		return {
			interest: [],
			principal: []
		};
	let principal = loanBorrowAmt;
	let monthlyRate = (loanIntRate as number) / 1200;
	let miPayments: Array<number> = [];
  let mpPayments: Array<number> = [];
  let loanEmi = emi;
  for (let i = 0; i < loanDuration && principal > 0; i++) {
    let irAdj: TargetInput | undefined | null = findTarget(loanIRAdjustments, i + 1);
    if(irAdj) monthlyRate = irAdj.val / 1200;
    let monthsAdj: TargetInput | undefined | null = findTarget(loanMonthsAdjustments, i + 1);
    if (monthsAdj) {
			let monthsVal = monthsAdj.val;
			loanDuration = i + (monthsVal < durationMonths ? monthsVal : durationMonths);
    }
		if (irAdj || monthsAdj) loanEmi = getEmi(principal, irAdj ? irAdj.val : loanIntRate, monthsAdj ? monthsAdj.val : loanMonths);
		let monthlyInt = principal * monthlyRate;
		miPayments.push(monthlyInt);
		let monthlyPayment = principal + monthlyInt < loanEmi ? principal + monthlyInt : loanEmi;
		let additionalPrincipalPaid: TargetInput | undefined | null = findTarget(loanPrepayments, i + 1);
		if (additionalPrincipalPaid) monthlyPayment += additionalPrincipalPaid.val;
		let principalPaid = monthlyPayment - monthlyInt;
		principal -= principalPaid;
		if (i === loanDuration - 1 && principal > 0) {
			principalPaid += principal;
			principal = 0;
		}
		mpPayments.push(principalPaid);
	}
	return {
		interest: miPayments,
		principal: mpPayments
	};
};

export const createYearlyFromMonthlyLoanCFs = (
	iPayments: Array<number>,
	pPayments: Array<number>,
	startMonthNum: number = 1
) => {
	if (!iPayments || !iPayments.length || !pPayments || !pPayments.length)
		return {
			interest: [],
			principal: []
		};
	let yearlyIPayments: Array<number> = [];
	let yearlyPPayments: Array<number> = [];
	let result = {
		interest: yearlyIPayments,
		principal: yearlyPPayments
	};
	let firstYearNum = 12 - (startMonthNum - 1);
	if (firstYearNum >= iPayments.length) firstYearNum = iPayments.length;
	let yearlyICF = 0;
	let yearlyPCF = 0;
	for (let i = 0; i < firstYearNum; i++) {
		yearlyICF += iPayments[i];
		yearlyPCF += pPayments[i];
	}
	result.interest.push(yearlyICF);
	result.principal.push(yearlyPCF);
	if (firstYearNum === iPayments.length) return result;
	yearlyICF = 0;
	yearlyPCF = 0;
	for (let i = 0; i + firstYearNum < iPayments.length; i++) {
		let index = i + firstYearNum;
		yearlyICF += iPayments[index];
		yearlyPCF += pPayments[index];
		if ((i + 1) % 12 === 0 || index === iPayments.length - 1) {
			result.interest.push(yearlyICF);
			result.principal.push(yearlyPCF);
			yearlyICF = 0;
			yearlyPCF = 0;
		}
	}
	return result;
};
