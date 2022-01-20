import { TargetInput } from "../../api/goals";

export function getEmi(loanAmt: number, annualRate: number, months: number) {
  if (loanAmt <= 0 || annualRate < 0 || months <= 0) return 0;
  if (!annualRate) return loanAmt / months;
  let monthlyRate = annualRate / 1200;
  return (
    (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

//Tested
export function getCompoundedRate(
  rate: number,
  years: number,
  frequency: number = 1
) {
  let r = rate ? rate : 0;
  let y = years ? years : 0;
  let f = frequency ? frequency : 1;
  return Math.pow(1 + r / (f * 100), f * y);
}
//Tested

export const getCompoundedIncome = (
  rate: number,
  value: number,
  years: number,
  frequency: number = 1
) => value * getCompoundedRate(rate, years, frequency);
//Tested

export function getNPV(
  rr: number | Array<number>,
  cashFlows: Array<number>,
  startIndex: number = 0,
  isMonthly: boolean = false,
  discountFirstCF: boolean = false
) {
  let totalPV = discountFirstCF ? 0 : cashFlows[0];
  for (let i = cashFlows.length - 1; i > (discountFirstCF ? -1 : 0); i--) {
    let dr = !rr
      ? 0
      : typeof rr === "number"
      ? rr
      : rr[startIndex + i]
      ? rr[startIndex + i]
      : rr[rr.length - 1];
    if (isMonthly) dr /= 12;
    totalPV = (cashFlows[i] + totalPV) / (1 + dr / 100);
  }
  return Math.round(totalPV);
}

export const findTarget = (
  loanPrepayments: Array<TargetInput>,
  installmentNum: number
) =>
  loanPrepayments && loanPrepayments.length > 0
    ? loanPrepayments.find((elem: TargetInput) => elem.num === installmentNum)
    : null;

const handleCustomPayment = (
  monthlyPrincipals: Array<number>,
  monthlyInterests: Array<number>,
  loanCustomPayments: Array<TargetInput>,
  installmentNum: number,
  principal: number,
  monthlyRate: number,
  totalSIDue: number
) => {
  let customPayment: TargetInput | undefined | null = findTarget(
    loanCustomPayments,
    installmentNum
  );
  if (customPayment) {
    let intDue = principal * monthlyRate;
    if (customPayment.val > intDue + totalSIDue) {
      monthlyInterests[installmentNum - 1] = intDue + totalSIDue;
      let principalPaid = customPayment.val - (intDue + totalSIDue);
      if (principalPaid > principal) principalPaid = principal;
      monthlyPrincipals[installmentNum - 1] = principalPaid;
      totalSIDue = 0;
    } else {
      monthlyInterests[installmentNum - 1] = customPayment.val;
      totalSIDue -= customPayment.val - intDue;
    }
  }
  return totalSIDue;
};

export const createEduLoanMonthlyCFs = (
  startYear: number,
  endYear: number,
  price: number,
  priceChgRate: number,
  loanPer: number,
  loanIntRate: number,
  loanCustomPayments: Array<TargetInput>,
  loanIRAdjustments: Array<TargetInput>,
  graceMonths: number = 0,
  semester: boolean = false
) => {
  let months = (endYear - startYear + 1) * 12;
  let eduCost = price;
  let principal = (eduCost * loanPer) / 100;
  let monthlyRate = loanIntRate / 1200;
  let totalSIDue = 0;
  let monthlyPrincipals: Array<number> = [0];
  let monthlyPrincipalDue: Array<number> = [principal];
  let monthlyInterests: Array<number> = [principal * monthlyRate];
  let downPayments: Array<number> = [eduCost * (1 - loanPer / 100)];
  for (let i = 1; i < months; i++) {
    totalSIDue = handleCustomPayment(
      monthlyPrincipals,
      monthlyInterests,
      loanCustomPayments,
      i,
      principal,
      monthlyRate,
      totalSIDue
    );
    principal -= monthlyPrincipals[i - 1];
    if (i % 12 === 0) {
      eduCost *= 1 + priceChgRate / 100;
      principal += (eduCost * loanPer) / 100;
      downPayments.push(eduCost * (1 - loanPer / 100));
    } else if (semester && i % 6 === 0) {
      principal += (eduCost * loanPer) / 100;
      downPayments.push(eduCost * (1 - loanPer / 100));
    } else downPayments.push(0);
    monthlyPrincipals.push(0);
    let irAdj: TargetInput | undefined | null = findTarget(
      loanIRAdjustments,
      i + 1
    );
    if (irAdj) monthlyRate = irAdj.val / 1200;
    monthlyInterests.push(principal * monthlyRate);
    monthlyPrincipalDue.push(principal);
  }
  for (let i = 0; i < graceMonths && principal > 0; i++) {
    totalSIDue = handleCustomPayment(
      monthlyPrincipals,
      monthlyInterests,
      loanCustomPayments,
      months + i,
      principal,
      monthlyRate,
      totalSIDue
    );
    principal -= monthlyPrincipals[months + i - 1];
    monthlyPrincipals.push(0);
    let irAdj: TargetInput | undefined | null = findTarget(
      loanIRAdjustments,
      months + i + 1
    );
    if (irAdj) monthlyRate = irAdj.val / 1200;
    monthlyInterests.push(principal * monthlyRate);
    monthlyPrincipalDue.push(principal);
  }
  if (totalSIDue > 0) principal += totalSIDue;
  return {
    principal: monthlyPrincipals,
    principalDue: monthlyPrincipalDue,
    interest: monthlyInterests,
    dp: downPayments,
    borrowAmt: principal,
  };
};

export const createAmortizingLoanCFs = (
  loanBorrowAmt: number,
  loanIntRate: number,
  emi: number,
  loanPrepayments: Array<TargetInput>,
  loanIRAdjustments: Array<TargetInput>,
  loanMonths: number,
  numOfYears: number | null,
  loanPMI: number,
  loanPMIEndPer: number,
  startingIndex: number = 0
) => {
  if (!loanBorrowAmt || !loanMonths || !emi)
    return {
      interest: [],
      principal: [],
      insurance: [],
    };
  let loanDuration = loanMonths;
  if (numOfYears && numOfYears * 12 < loanMonths)
    loanDuration = numOfYears * 12;
  let principal = loanBorrowAmt;
  let monthlyRate = (loanIntRate as number) / 1200;
  let miPayments: Array<number> = [];
  let mpPayments: Array<number> = [];
  let insPayments: Array<number> = [];
  let loanEmi = emi;
  let loanPMIEndAmt = loanBorrowAmt * (loanPMIEndPer / 100);
  for (let i = 0; i < loanDuration && principal > 0; i++) {
    if (loanPMI && loanPMIEndAmt < principal) insPayments.push(loanPMI);
    let irAdj: TargetInput | undefined | null = findTarget(
      loanIRAdjustments,
      startingIndex + i + 1
    );
    if (irAdj) {
      monthlyRate = irAdj.val / 1200;
      loanEmi = getEmi(loanBorrowAmt, irAdj.val, loanMonths);
    }
    let monthlyInt = principal * monthlyRate;
    miPayments.push(monthlyInt);
    let monthlyPayment =
      principal + monthlyInt < loanEmi ? principal + monthlyInt : loanEmi;
    let additionalPrincipalPaid: TargetInput | undefined | null = findTarget(
      loanPrepayments,
      startingIndex + i + 1
    );
    if (additionalPrincipalPaid) monthlyPayment += additionalPrincipalPaid.val;
    let principalPaid = monthlyPayment - monthlyInt;
    principal -= principalPaid;
    if (principal < 1 || (i === loanDuration - 1 && principal > 0)) {
      principalPaid += principal;
      principal = 0;
    }
    mpPayments.push(principalPaid);
  }
  return {
    interest: miPayments,
    principal: mpPayments,
    insurance: insPayments,
  };
};

export const createYearlyFromMonthlyLoanCFs = (
  iPayments: Array<number>,
  pPayments: Array<number>,
  insPayments: Array<number>,
  startMonthNum: number,
  loanRepaymentMonths: number
) => {
  if (!iPayments || !iPayments.length)
    return {
      interest: [],
      principal: [],
      insurance: [],
    };
  let yearlyIPayments: Array<number> = [];
  let yearlyPPayments: Array<number> = [];
  let yearlyInsPayments: Array<number> = [];
  let result = {
    interest: yearlyIPayments,
    principal: yearlyPPayments,
    insurance: yearlyInsPayments,
  };
  let startingMonth = startMonthNum + loanRepaymentMonths;
  if (startingMonth > 12) startingMonth = startingMonth % 12;
  let numOfMonthsInFirstYear = 12 - (startingMonth - 1);
  if (numOfMonthsInFirstYear >= iPayments.length)
    numOfMonthsInFirstYear = iPayments.length;
  let yearlyICF = 0;
  let yearlyPCF = 0;
  let yearlyInsCF = 0;
  for (let i = 0; i < numOfMonthsInFirstYear; i++) {
    yearlyICF += iPayments[i];
    yearlyPCF += pPayments[i];
    if (insPayments[i]) yearlyInsCF += insPayments[i];
  }
  result.interest.push(yearlyICF);
  result.principal.push(yearlyPCF);
  result.insurance.push(yearlyInsCF);
  if (numOfMonthsInFirstYear === iPayments.length) return result;
  yearlyICF = 0;
  yearlyPCF = 0;
  yearlyInsCF = 0;
  for (let i = 0; i + numOfMonthsInFirstYear < iPayments.length; i++) {
    let index = i + numOfMonthsInFirstYear;
    yearlyICF += iPayments[index];
    yearlyPCF += pPayments[index];
    if (insPayments[index]) yearlyInsCF += insPayments[index];
    if ((i + 1) % 12 === 0 || index === iPayments.length - 1) {
      result.interest.push(yearlyICF);
      result.principal.push(yearlyPCF);
      result.insurance.push(yearlyInsCF);
      yearlyICF = 0;
      yearlyPCF = 0;
      yearlyInsCF = 0;
    }
  }
  return result;
};
