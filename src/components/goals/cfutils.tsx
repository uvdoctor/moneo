import * as APIt from "../../api/goals";
import {
  getCompoundedIncome,
  createYearlyFromMonthlyLoanCFs,
  createAmortizingLoanCFs,
  createEduLoanMonthlyCFs,
} from "../calc/finance";
import { appendValue, buildArray, getAllAssetTypes } from "../utils";
import { isTaxCreditEligible } from "./goalutils";
import { BuyType, GoalType, RiskProfile, TargetInput } from "../../api/goals";
//Tested
export const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
  if (!val || val < 0 || !tr || (tr === 100 && maxTaxDL === 0)) return 0;
  if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL;
  return Math.round(val * (tr / 100));
};

export const calculateBuyAnnualNetCF = (
  startYear: number,
  startMonth: number,
  duration: number,
  amCostPer: number,
  amStartYear: number,
  chgRate: number,
  index: number,
  p: number,
  aiPer: number,
  aiSY: number,
  buyType: BuyType | null | undefined,
  runningCost: number,
  runningCostChg: number
) => {
  let annualNetCF = 0;
  let yearlyPrice =
    !index || chgRate <= 0 ? p : getCompoundedIncome(chgRate, p, index);
  let yearFactor = 1;
  if (!index) yearFactor = (12 - (startMonth - 1)) / 12;
  else if (index === duration - 1 && startMonth > 1)
    yearFactor = (startMonth - 1) / 12;
  if (amCostPer && startYear + index >= amStartYear)
    annualNetCF -= yearlyPrice * (amCostPer / 100) * yearFactor;
  if (aiPer && startYear + index >= aiSY)
    annualNetCF += yearlyPrice * (aiPer / 100) * yearFactor;
  if (buyType === BuyType.V && runningCost)
    annualNetCF -=
      yearFactor *
      (!index
        ? runningCost * 12
        : getCompoundedIncome(runningCostChg, runningCost * 12, index));
  return Math.round(annualNetCF);
};
//Tested
export const calculateTotalAmt = (
  startYear: number,
  annualPer: number,
  annualSY: number,
  price: number,
  chgRate: number,
  sellAfter: number
) => {
  let ta = 0;
  for (let i = 0; i < sellAfter; i++) {
    if (startYear + i < annualSY) continue;
    let yearlyPrice =
      i === 0 || chgRate <= 0 ? price : getCompoundedIncome(chgRate, price, i);
    ta += yearlyPrice * (annualPer / 100);
  }
  return Math.round(ta);
};

export const calculateTotalRunningCost = (
  runningCost: number,
  chgRate: number,
  sellAfter: number
) => {
  if (!runningCost) return 0;
  let ta = 0;
  for (let i = 0; i < sellAfter; i++) {
    ta +=
      i === 0 || chgRate <= 0
        ? runningCost * 12
        : getCompoundedIncome(chgRate, runningCost * 12, i);
  }
  return Math.round(ta);
};

//Tested
export const calculateSellPrice = (
  price: number,
  chgRate: number,
  numOfYears: number
) => Math.round(getCompoundedIncome(chgRate, price, numOfYears));

const calculatePrice = (goal: APIt.CreateGoalInput) => {
  let price = 0;
  if (goal.manual && goal.tgts) {
    goal.tgts.forEach((t) => (price += t.val));
  } else if (!goal.manual && goal.cp) {
    price = getCompoundedIncome(
      goal.chg as number,
      goal.cp as number,
      goal.sy - goal.by
    );
  }
  return price;
};
// Need to test
export const calculateCFs = (
  price: number | null,
  goal: APIt.CreateGoalInput,
  duration: number,
  considerStartMonth: boolean = true
) => {
  if (price === null) price = calculatePrice(goal); //tested
  if (goal?.manual) return createManualCFs(price, goal, duration);
  if (goal?.loan?.per)
    return createAutoLoanCFs(price, goal, duration, considerStartMonth);
  return createAutoCFs(price, goal, duration, considerStartMonth);
};

export const calculateTotalCPTaxBenefit = (
  taxRate: number,
  maxTDL: number,
  paymentSY: number,
  payment: number,
  paymentChgRate: number,
  duration: number,
  premiumBY: number
) => {
  if (!taxRate) return 0;
  let totalTaxBenefit = 0;
  let nowYear = new Date().getFullYear();
  let premiumYear = nowYear > paymentSY ? nowYear + 1 : paymentSY;
  for (let year = premiumYear; year < paymentSY + duration; year++) {
    let premium = getCompoundedIncome(
      paymentChgRate,
      payment,
      year - (premiumBY + 1)
    );
    totalTaxBenefit += getTaxBenefit(premium, taxRate, maxTDL);
  }
  return totalTaxBenefit;
};

export const calculateTotalCP = (
  paymentSY: number,
  payment: number,
  paymentChgRate: number,
  duration: number,
  premiumBY: number
) => {
  if (!payment) return 0;
  let total = 0;
  let nowYear = new Date().getFullYear();
  let premiumYear = nowYear > paymentSY ? nowYear + 1 : paymentSY;
  for (let year = premiumYear; year < paymentSY + duration; year++) {
    total += getCompoundedIncome(
      paymentChgRate,
      payment,
      year - (premiumBY + 1)
    );
  }
  return total;
};

const getYearEndPortfolioValue = (
  amt: number,
  avgSavings: number,
  monthlyIncrease: number,
  maxMonthlySavings: number
) => {
  let total = amt;
  let num = avgSavings;
  for (let m = new Date().getMonth(); m <= 11; m++) {
    let monthlySavings = num * (1 + monthlyIncrease / 100);
    if (monthlySavings > maxMonthlySavings) monthlySavings = maxMonthlySavings;
    num = monthlySavings;
    total += num;
  }
  return total;
};

const getYearEndSavingsVal = (
  monthlySavings: number,
  rate: number,
  startingMonth: number = 0
) => {
  let month = startingMonth;
  let savings = Math.round(monthlySavings);
  while (month <= 11) {
    savings *= 1 + rate / 100;
    month++;
  }
  return savings;
};

export const calculateFFCFs = (g: APIt.CreateGoalInput, ffYear: number) => {
  let cfs: Array<number> = [];
  let nowYear = new Date().getFullYear();
  const highestPossibleSavings = g.loan?.pmi as number;
  let nextYearSavings = getYearEndSavingsVal(
    g.rachg as number,
    g.tbr as number,
    new Date().getMonth()
  );
  if (nextYearSavings > highestPossibleSavings)
    nextYearSavings = highestPossibleSavings;
  for (let i = 1; i <= ffYear - (nowYear + 1); i++) {
    let month = 0;
    let totalAnnualInv = 0;
    while (month <= 11) {
      nextYearSavings *= 1 + (g.tbr as number) / 100;
      if (nextYearSavings > highestPossibleSavings)
        nextYearSavings = highestPossibleSavings;
      totalAnnualInv += nextYearSavings;
      month++;
    }
    cfs.push(Math.round(totalAnnualInv));
  }
  let ffGoalEndYear = g.sy + (g.loan?.dur as number);
  for (let year = ffYear; year <= ffGoalEndYear; year++) {
    let cf =
      getCompoundedIncome(
        g.btr as number,
        g.tdli as number,
        year - (g.ey + 1)
      ) *
      (1 + g.tdr / 100);
    cfs.push(Math.round(-cf));
  }
  if ((g?.cp as number) && g.amsy && g.achg && nowYear < g.amsy + g.achg) {
    let premiumYear = nowYear >= g.amsy ? nowYear + 1 : g.amsy;
    for (let year = premiumYear; year < g.amsy + g.achg; year++) {
      let premium = getCompoundedIncome(
        g.amper as number,
        g.cp as number,
        (year as number) - ((g.chg as number) + 1)
      );
      let index = cfs.length - 1 - (ffGoalEndYear - year);
      cfs[index] -= premium;
      cfs[index + 1] += getTaxBenefit(premium, g.tdr, g.tdl);
    }
  }
  if (g?.tbi && g.aisy) {
    let incomeYear = nowYear >= g.aisy ? nowYear + 1 : g.aisy;
    for (let year = incomeYear; year <= ffGoalEndYear; year++) {
      let income = getCompoundedIncome(
        g.aiper as number,
        g.tbi as number,
        year - incomeYear
      );
      let index = cfs.length - 1 - ((ffGoalEndYear - year) as number);
      cfs[index] += income;
    }
  }
  g.pg?.forEach((t: any) => {
    let index = cfs.length - 1 - (ffGoalEndYear - t?.num);
    cfs[index] += t?.val as number;
  });
  g.pl?.forEach((t: any) => {
    let index = cfs.length - 1 - (ffGoalEndYear - t?.num);
    cfs[index] -= t?.val as number;
  });
  return cfs;
};

// not used at present
export const calculateSellCFs = (
  goal: APIt.CreateGoalInput,
  duration: number
) => {
  let cfs: Array<number> = [];
  let p = goal.cp as number;
  for (let i = 0; i < duration; i++) {
    let netAnnualAmt = calculateBuyAnnualNetCF(
      goal.sy,
      goal.sm as number,
      duration,
      goal.amper as number,
      goal.amsy as number,
      goal.achg as number,
      0,
      p,
      goal.aiper as number,
      goal.aisy as number,
      goal.bt,
      goal.rc as number,
      goal.rcchg as number
    );
    cfs.push(Math.round(netAnnualAmt));
  }
  cfs[cfs.length - 1] = calculateSellPrice(p, goal?.achg as number, duration);
  return cfs;
};

const createAutoCFs = (
  p: number,
  goal: APIt.CreateGoalInput,
  duration: number,
  considerStartMonth: boolean = true
) => {
  let cfs: Array<number> = [];
  let totalTaxBenefit = 0;
  let startingMonth = considerStartMonth ? (goal.sm as number) : 1;
  if (goal.type === APIt.GoalType.B && duration) {
    cfs.push(Math.round(-p));
    for (let i = 0; i < duration; i++) {
      let netCF = calculateBuyAnnualNetCF(
        goal.sy,
        startingMonth,
        duration,
        goal.amper as number,
        goal.amsy as number,
        goal.achg as number,
        i,
        p,
        goal.aiper as number,
        goal.aisy as number,
        goal.bt,
        goal.rc as number,
        goal.rcchg as number
      );
      if (cfs[i]) cfs[i] += Math.round(netCF);
      else cfs.push(Math.round(netCF));
    }
    cfs[cfs.length - 1] += calculateSellPrice(
      p,
      goal?.achg as number,
      duration
    );
    let tb = getTaxBenefit(
      p,
      isTaxCreditEligible(goal.type) ? 100 : goal.tdr,
      goal.tdl
    );
    if (tb) {
      if (cfs[1]) cfs[1] += tb;
      else cfs.push(tb);
      totalTaxBenefit += tb;
    }
  } else {
    let taxBenefit = 0;
    for (
      let i = 0, v = p;
      i < duration;
      i++, v = getCompoundedIncome(goal.chg as number, p, i)
    ) {
      cfs.push(Math.round(-v + taxBenefit));
      taxBenefit = getTaxBenefit(
        v,
        isTaxCreditEligible(goal.type) ? 100 : goal.tdr,
        goal.tdl
      );
      totalTaxBenefit += taxBenefit;
    }
    if (taxBenefit > 0) cfs.push(taxBenefit);
  }
  return { cfs: cfs, ptb: totalTaxBenefit };
};

export const getLoanBorrowAmt = (
  price: number,
  goalType: APIt.GoalType,
  manualMode: number,
  chgRate: number,
  numOfYears: number,
  loanPer: number
) => {
  let p = price;
  if (goalType !== APIt.GoalType.B && !manualMode && numOfYears > 0) {
    for (
      let i = 0, v = 0;
      i <= numOfYears;
      i++, v = getCompoundedIncome(chgRate, price, i)
    ) {
      p += v;
    }
  }
  let result = p * ((loanPer as number) / 100);
  return result;
};

export const adjustAccruedInterest = (
  loanBorrowAmt: number,
  repaymentMonths: number,
  loanRate: number
) => (loanBorrowAmt *= 1 + (loanRate * repaymentMonths) / 1200);

export const getEduLoanAnnualDPs = (
  startMonth: number,
  monthlyDPs: Array<number>
) => {
  let cfs: Array<number> = [];
  let month = startMonth;
  let yearlyDP = 0;
  monthlyDPs.forEach((dp: number) => {
    yearlyDP += dp;
    if (month === 12) {
      month = 1;
      cfs.push(yearlyDP);
      yearlyDP = 0;
    } else month++;
  });
  return cfs;
};

const createAutoLoanCFs = (
  price: number,
  goal: APIt.CreateGoalInput,
  duration: number,
  considerStartMonth: boolean = true
) => {
  let loanStartingCFs: Array<number> = [];
  let loanSchedule: any = {};
  if (goal.type === GoalType.E) {
    let result = createEduLoanMonthlyCFs(
      goal.sy,
      goal.ey,
      price,
      goal.chg as number,
      goal?.loan?.per as number,
      goal?.loan?.rate as number,
      goal?.loan?.pp as Array<TargetInput>,
      goal?.loan?.ira as Array<TargetInput>,
      goal.achg as number,
      goal.tbr ? true : false
    );
    loanStartingCFs = getEduLoanAnnualDPs(goal.sm as number, result.dp);
    loanSchedule = createAmortizingLoanCFs(
      result.borrowAmt,
      getClosestTargetVal(
        goal?.loan?.ira as Array<TargetInput>,
        result.interest.length,
        goal?.loan?.rate as number
      ),
      goal?.loan?.emi as number,
      goal?.loan?.pp as Array<TargetInput>,
      goal?.loan?.ira as Array<TargetInput>,
      goal?.loan?.dur as number,
      null,
      0,
      0,
      result.interest.length
    );
    loanSchedule.interest = [...result.interest, ...loanSchedule.interest];
    loanSchedule.principal = [...result.principal, ...loanSchedule.principal];
  } else {
    let loanBorrowAmt = getLoanBorrowAmt(
      price,
      goal.type,
      goal.manual,
      goal.chg as number,
      goal.ey - goal.sy,
      goal?.loan?.per as number
    );
    loanStartingCFs = [
      Math.round(loanBorrowAmt / ((goal?.loan?.per as number) / 100)) -
        loanBorrowAmt,
    ];
    loanBorrowAmt = adjustAccruedInterest(
      loanBorrowAmt,
      goal?.loan?.ry as number,
      goal?.loan?.per as number
    );
    loanSchedule = createAmortizingLoanCFs(
      loanBorrowAmt,
      goal?.loan?.rate as number,
      goal?.loan?.emi as number,
      goal?.loan?.pp as Array<TargetInput>,
      goal?.loan?.ira as Array<TargetInput>,
      goal?.loan?.dur as number,
      goal?.sa ? goal.sa : null,
      goal?.loan?.pmi as number,
      goal?.loan?.peper as number
    );
  }
  return createLoanCFs(
    price,
    loanStartingCFs,
    loanSchedule.interest,
    loanSchedule.principal,
    loanSchedule.insurance,
    goal,
    duration,
    considerStartMonth
  );
};

export const createLoanCFs = (
  price: number,
  loanStartingCFs: Array<number>,
  iSchedule: Array<number>,
  pSchedule: Array<number>,
  insSchedule: Array<number>,
  goal: APIt.CreateGoalInput,
  duration: number,
  considerStartMonth: boolean = true
) => {
  if (
    !price ||
    !duration ||
    !iSchedule ||
    !iSchedule.length ||
    !pSchedule ||
    !pSchedule.length
  )
    return [
      {
        cfs: [0],
        ptb: 0,
        itb: 0,
      },
    ];
  let cfs: Array<number> = [...loanStartingCFs];
  let totalPTaxBenefit = 0;
  let totalITaxBenefit = 0;
  let startingMonth = considerStartMonth ? (goal.sm as number) : 1;
  let annualLoanPayments: any = createYearlyFromMonthlyLoanCFs(
    iSchedule,
    pSchedule,
    insSchedule,
    startingMonth,
    goal.loan?.ry as number
  );
  let sp = 0;
  let taxBenefit = 0;
  let loanStartingYear = goal.sy;
  let endingYear = goal.sy + duration - 1;
  if (startingMonth + (goal.loan?.ry as number) > 12) loanStartingYear++;
  for (let year = goal.sy; year <= endingYear; year++) {
    let index = year - goal.sy;
    let cf = cfs[index] ? cfs[index] : 0;
    cf -= taxBenefit;
    taxBenefit = 0;
    let i = year - loanStartingYear;
    if (i >= 0 && i < annualLoanPayments.interest.length) {
      let annualIPayment = annualLoanPayments.interest[i];
      let annualPPayment = annualLoanPayments.principal[i];
      cf += annualIPayment + annualPPayment;
      let annualInsPayment = annualLoanPayments.insurance[i];
      if (annualInsPayment) cf += annualInsPayment;
      if (!isTaxCreditEligible(goal.type)) {
        if (goal.type !== APIt.GoalType.E)
          taxBenefit = getTaxBenefit(annualPPayment, goal.tdr, goal.tdl);
        totalPTaxBenefit += taxBenefit;
        let itb =
          (goal.tbi as number) > 0
            ? getTaxBenefit(annualIPayment, goal.tdr, goal.tdli as number)
            : 0;
        taxBenefit += itb;
        totalITaxBenefit += itb;
      }
    }
    if (goal.type === APIt.GoalType.B) {
      cf -= calculateBuyAnnualNetCF(
        goal.sy,
        startingMonth,
        duration,
        goal.amper as number,
        goal.amsy as number,
        goal.achg as number,
        year - goal.sy,
        price,
        goal.aiper as number,
        goal.aisy as number,
        goal.bt,
        goal.rc as number,
        goal.rcchg as number
      );
    }
    if (isTaxCreditEligible(goal.type)) {
      let ptb = getTaxBenefit(cf, 100, goal.tdl);
      taxBenefit += ptb;
      totalPTaxBenefit += ptb;
    }
    if (!Number.isNaN(cfs[index])) cfs[index] = Math.round(-cf);
    else cfs.push(cf ? Math.round(-cf) : 0);
  }
  if (goal.type === APIt.GoalType.B) {
    sp = calculateSellPrice(price, goal?.achg as number, duration);
    cfs[cfs.length - 1] += Math.round(sp);
    if (taxBenefit) cfs.push(Math.round(taxBenefit));
  }
  return {
    cfs: cfs,
    ptb: totalPTaxBenefit,
    itb: totalITaxBenefit,
  };
};

const createManualCFs = (
  p: number,
  goal: APIt.CreateGoalInput,
  duration: number
) => {
  if (!goal.tgts) return [];
  let targets = goal.tgts;
  let cfs: Array<number> = [];
  let taxBenefitPrev = 0;
  let totalTaxBenefit = 0;
  for (let i = 0; i < duration; i++) {
    let v = 0;
    if (i < targets.length) v = targets[i].val;
    let taxBenefit = getTaxBenefit(
      v,
      isTaxCreditEligible(goal.type) ? 100 : goal.tdr,
      goal.tdl
    );
    v -= taxBenefitPrev;
    taxBenefitPrev = taxBenefit;
    totalTaxBenefit += taxBenefit;
    if (goal.type === APIt.GoalType.B && duration)
      v -= Math.round(
        calculateBuyAnnualNetCF(
          goal.sy,
          goal.sm as number,
          duration,
          goal?.amper as number,
          goal?.amsy as number,
          goal?.achg as number,
          i,
          p,
          goal.aiper as number,
          goal.aisy as number,
          goal.bt,
          goal.rc as number,
          goal.rcchg as number
        )
      );
    cfs.push(v ? -v : 0);
  }
  if (goal.type === APIt.GoalType.B) {
    let remPayment = 0;
    if (duration < targets.length) {
      for (let i = duration; i < targets.length; i++) {
        if (targets[i] && targets[i].val) remPayment += targets[i].val;
      }
    }
    let sp = calculateSellPrice(p, goal?.achg as number, duration);
    cfs.push(Math.round(sp + taxBenefitPrev - remPayment));
    taxBenefitPrev = getTaxBenefit(
      remPayment,
      isTaxCreditEligible(goal.type) ? 100 : goal.tdr,
      goal.tdl
    );
    totalTaxBenefit += taxBenefitPrev;
  }
  if (taxBenefitPrev > 0) cfs.push(Math.round(taxBenefitPrev));
  return { cfs: cfs, ptb: totalTaxBenefit };
};

const calculateMustAllocation = (
  ffGoal: APIt.CreateGoalInput,
  mustCFs: Array<number>,
  ffYear: number | null
) => {
  let nowYear = new Date().getFullYear();
  let cashAA: any = {};
  let bondsAA: any = {};
  for (
    let year = nowYear + 1;
    year <= ffGoal.sy + (ffGoal.loan?.dur as number);
    year++
  ) {
    let livingExp: number =
      !ffYear || year < ffYear
        ? Math.round(
            getCompoundedIncome(
              ffGoal.loan?.per as number,
              ffGoal.loan?.emi as number,
              year - (ffGoal.loan?.ry as number)
            )
          )
        : getCompoundedIncome(
            ffGoal.btr as number,
            ffGoal.tdli as number,
            year - ffYear
          );
    cashAA[year] = Math.round(livingExp);
    if (
      mustCFs.hasOwnProperty(year - (nowYear + 1)) &&
      mustCFs[year - (nowYear + 1)] < 0
    )
      cashAA[year] -= mustCFs[year - (nowYear + 1)];
    let depCF = 0;
    let bondsCF = 0;
    for (let futureYear = year + 1; futureYear < year + 5; futureYear++) {
      let mustCF = mustCFs[futureYear - (nowYear + 1)];
      if (mustCF && mustCF < 0) {
        if (futureYear === year + 1) depCF -= mustCF;
        else bondsCF -= mustCF;
      }
    }
    cashAA[year] += depCF;
    bondsAA[year] = bondsCF;
  }
  return { cash: cashAA, bonds: bondsAA };
};

const calculateTryAllocation = (
  ffGoal: APIt.CreateGoalInput,
  tryCFs: Array<number>
) => {
  let nowYear = new Date().getFullYear();
  let bondAA: any = {};
  for (
    let year = nowYear + 1;
    year <= ffGoal.sy + (ffGoal.loan?.dur as number);
    year++
  ) {
    let cf = 0;
    for (let bondYear = year; bondYear < year + 3; bondYear++) {
      let tryCF = tryCFs[bondYear - (nowYear + 1)];
      if (tryCF && tryCF < 0) cf -= tryCF;
    }
    bondAA[year] = cf;
  }
  return bondAA;
};

const buildEmptyAA = (fromYear: number, toYear: number) => {
  let emptyAA: any = {};
  getAllAssetTypes().forEach(
    (key) => (emptyAA[key] = buildArray(fromYear, toYear))
  );
  return emptyAA;
};

const getRR = (aa: any, index: number, pp: any) => {
  let perf = 0;
  for (const prop in aa) {
    perf += (pp[prop] * aa[prop][index]) / 100;
  }
  return perf;
};

const allocate = (
  arr: Array<number>,
  index: number,
  val: number,
  remVal: number,
  maxLimit: number = 100,
  minLimit: number = 0
) => {
  if (remVal <= 0) return 0;
  if (val < 0) return remVal;
  if (val < minLimit) val = minLimit;
  if (val > maxLimit) val = maxLimit;
  if (val > remVal) val = remVal;
  arr[index] += val;
  return remVal - val;
};

const allocateREIT = (
  aa: any,
  year: number,
  ffYear: number,
  ffGoal: APIt.CreateGoalInput,
  remPer: number
) => {
  if (!remPer || ffGoal.rp === RiskProfile.VC) return remPer;
  let nowYear = new Date().getFullYear();
  let i = year - (nowYear + 1);
  let ffGoalEndYear = ffGoal.sy + (ffGoal.loan?.dur as number);
  let reitPer = ffGoal.rp === RiskProfile.C ? 5 : 10;
  if (year >= ffYear) {
    if (year > ffGoalEndYear - 5) reitPer = 25;
    else if (year >= ffGoalEndYear - 20) reitPer = 20;
    else reitPer += 5;
  }
  remPer = allocate(
    ffGoal.ccy === "INR" ? aa.reit : aa.reitETF,
    i,
    reitPer *
      (ffGoal.rp === RiskProfile.C || ffGoal.rp === RiskProfile.M ? 1 : 0.5),
    remPer
  );
  if (ffGoal.rp === RiskProfile.A || ffGoal.rp === RiskProfile.VA) {
    remPer = allocate(
      ffGoal.rp === RiskProfile.A ? aa.ireitETF : aa.ireit,
      i,
      reitPer * 0.5,
      remPer
    );
  }
  return remPer;
};

const allocateStocks = (
  aa: any,
  year: number,
  ffYear: number,
  ffGoal: APIt.CreateGoalInput,
  remPer: number
) => {
  if (!remPer) return remPer;
  let nowYear = new Date().getFullYear();
  let i = year - (nowYear + 1);
  const ffGoalEndYear = ffGoal.sy + (ffGoal.loan?.dur as number);
  let maxStocksPer =
    ffGoal.rp === RiskProfile.VA ? 140 : 120 - (year - ffGoal.sy);
  let maxAllowedPer =
    ffGoal.rp === RiskProfile.VA ? 100 : ffGoal.rp === RiskProfile.A ? 80 : 60;
  const goldAsset = ffGoal.ccy === "INR" ? aa.goldb : aa.gold;
  if (maxStocksPer > maxAllowedPer) maxStocksPer = maxAllowedPer;
  if (maxStocksPer > remPer) maxStocksPer = remPer;
  remPer = allocate(
    goldAsset,
    i,
    Math.round(
      maxStocksPer *
        (ffGoal.rp === RiskProfile.VA || ffGoal.rp === RiskProfile.A
          ? 0.1
          : 0.2)
    ),
    remPer
  );
  maxStocksPer -= goldAsset[i];
  if (year >= ffGoalEndYear - 20) {
    remPer = allocate(
      aa.dgs,
      i,
      Math.round(((100 - 2 * (ffGoalEndYear - year)) / 100) * maxStocksPer),
      remPer
    );
  } else {
    if (ffGoal.rp === RiskProfile.VA) {
      if (year < ffYear)
        remPer = allocate(aa.imscs, i, Math.round(maxStocksPer * 0.2), remPer);
      remPer = allocate(
        aa.mscs,
        i,
        Math.round(maxStocksPer * (year < ffYear ? 0.3 : 0.4)),
        remPer
      );
    }
    remPer = allocate(
      ffGoal.rp === RiskProfile.M ? aa.ilcetf : aa.ilcs,
      i,
      Math.round(maxStocksPer * 0.3),
      remPer
    );
    remPer = allocate(
      ffGoal.rp === RiskProfile.M ? aa.lcetf : aa.lcs,
      i,
      Math.round(
        maxStocksPer *
          (ffGoal.rp === RiskProfile.VA
            ? 0.2
            : ffGoal.rp === RiskProfile.A
            ? 0.4
            : 0.7)
      ),
      remPer
    );
  }
  return remPer;
};

const calculateAllocation = (
  ffGoal: APIt.CreateGoalInput,
  y: number,
  cs: number,
  aa: any,
  mustAllocation: any,
  tryBA: number,
  ffYear: number
) => {
  let nowYear = new Date().getFullYear();
  let i = y - (nowYear + 1);
  let remPer = allocate(
    aa.cash,
    i,
    Math.round((mustAllocation.cash[y] / cs) * 100),
    100
  );
  if (!remPer) return;
  remPer = allocate(
    aa.ltdep,
    i,
    Math.round(
      remPer *
        (ffGoal.rp === RiskProfile.VC
          ? 0.3
          : ffGoal.rp === RiskProfile.C
          ? 0.2
          : 0.1)
    ),
    remPer
  );
  const allocateTEBonds = y < ffYear && ffGoal.manual > 0;
  let fixedIncomeTEAsset = aa.teb;
  let fixedIncomeAsset = aa.mtb;
  let goldAsset = ffGoal.ccy === "INR" ? aa.goldb : aa.gold;
  remPer = allocate(
    aa.ltdep,
    i,
    Math.round((mustAllocation.bonds[y] / cs) * 100),
    remPer
  );
  remPer = allocate(
    fixedIncomeAsset,
    i,
    Math.round(((0.5 * tryBA) / cs) * 100),
    remPer
  );
  remPer = allocate(
    allocateTEBonds ? fixedIncomeTEAsset : fixedIncomeAsset,
    i,
    Math.round(((0.5 * tryBA) / cs) * 100),
    remPer
  );
  if (!remPer) return;
  remPer = allocate(
    aa.re,
    i,
    Math.round(
      remPer *
        (ffGoal.rp === RiskProfile.VC
          ? 0.4
          : RiskProfile.C
          ? 0.3
          : ffGoal.rp === RiskProfile.M
          ? 0.1
          : 0.05)
    ),
    remPer,
    ffGoal.rp === RiskProfile.VC
      ? 40
      : ffGoal.rp === RiskProfile.C
      ? 20
      : ffGoal.rp === RiskProfile.M
      ? 10
      : 5
  );
  if (!remPer) return;
  if (ffGoal.rp === RiskProfile.VC || ffGoal.rp === RiskProfile.C) {
    if (ffGoal.rp === RiskProfile.C)
      remPer = allocate(aa.lcetf, i, Math.round(remPer * 0.1), remPer);
    remPer = allocate(goldAsset, i, Math.round(remPer * 0.2), remPer);
    if (ffGoal.rp === RiskProfile.C)
      remPer = allocate(aa.reit, i, Math.round(remPer * 0.1), remPer);
    remPer = allocate(
      allocateTEBonds ? fixedIncomeTEAsset : fixedIncomeAsset,
      i,
      Math.round(remPer * 0.5),
      remPer
    );
    remPer = allocate(fixedIncomeAsset, i, remPer, remPer);
  } else {
    if (ffGoal.rp === RiskProfile.VA)
      remPer = allocate(aa.crypto, i, Math.round(remPer * 0.02), remPer);
    remPer = allocate(
      aa.p2p,
      i,
      Math.round(
        remPer *
          (ffGoal.rp === RiskProfile.M
            ? 0.01
            : ffGoal.rp === RiskProfile.A
            ? 0.03
            : 0.05)
      ),
      remPer
    );
    remPer = allocate(
      aa.uc,
      i,
      Math.round(
        remPer *
          (ffGoal.rp === RiskProfile.M
            ? 0
            : ffGoal.rp === RiskProfile.A
            ? 0.05
            : 0.1)
      ),
      remPer
    );
    remPer = allocateREIT(aa, y, ffYear, ffGoal, remPer);
    if (!remPer) return;
    let teBondsPer = fixedIncomeTEAsset[i];
    let meBondsPer = fixedIncomeAsset[i];
    if (teBondsPer + meBondsPer < 15) {
      if (allocateTEBonds)
        remPer = allocate(fixedIncomeTEAsset, i, 5 - teBondsPer, remPer);
      let minMEBondsPer = !allocateTEBonds ? 10 : 5;
      remPer = allocate(
        fixedIncomeAsset,
        i,
        minMEBondsPer - meBondsPer,
        remPer
      );
      let totalBondsPer = fixedIncomeTEAsset[i] + fixedIncomeAsset[i];
      remPer = allocate(aa.imtb, i, 15 - totalBondsPer, remPer);
    } else remPer = allocate(aa.imtb, i, 5, remPer);
    if (!remPer) return;
    remPer = allocateStocks(aa, y, ffYear, ffGoal, remPer);
    if (remPer) {
      if (allocateTEBonds)
        remPer = allocate(
          fixedIncomeTEAsset,
          i,
          Math.round(remPer * 0.4),
          remPer
        );
      remPer = allocate(fixedIncomeAsset, i, Math.round(remPer * 0.7), remPer);
      allocate(aa.imtb, i, remPer, remPer);
    }
  }
};

export const checkForFF = (
  ffGoal: APIt.CreateGoalInput,
  ffYear: number,
  mergedCFs: Object,
  mustCFs: Array<number>,
  tryCFs: Array<number>
) => {
  let mCFs: any = Object.assign({}, mergedCFs);
  let cs = getYearEndPortfolioValue(
    ffGoal.ra as number,
    ffGoal.rachg as number,
    ffGoal.tbr as number,
    ffGoal.loan?.pmi as number
  );
  let cfs: Array<number> = calculateFFCFs(ffGoal, ffYear);
  let nowYear = new Date().getFullYear();
  cfs.forEach((cf, i) => {
    let index = nowYear + 1 + i;
    appendValue(mCFs, index, cf);
  });
  let ffAmt = 0;
  let ffCfs: any = {};
  ffCfs[nowYear] = Math.round(cs);
  let ffGoalEndYear = ffGoal.sy + (ffGoal.loan?.dur as number);
  let mustAllocation = calculateMustAllocation(ffGoal, mustCFs, ffYear);
  let tryAllocation = calculateTryAllocation(ffGoal, tryCFs);
  let aa: any = buildEmptyAA(nowYear + 1, ffGoalEndYear);
  let rr: Array<number> = [];
  let minReq = 0;
  let oom = [];
  for (let [year, value] of Object.entries(mCFs)) {
    let y = parseInt(year);
    if (y > ffGoalEndYear) break;
    let v = parseInt(value as string);
    let cash = mustAllocation.cash[y];
    let mustBA = mustAllocation.bonds[y];
    let tryBA = tryAllocation[y];
    minReq = cash + mustBA;
    if (y >= ffYear) minReq += tryBA;
    if (minReq < 0) minReq = 0;
    let i = y - (nowYear + 1);
    let rate = 0;
    if (cs > minReq)
      calculateAllocation(ffGoal, y, cs, aa, mustAllocation, tryBA, ffYear);
    else {
      if (cs <= 0 || cash <= 0 || cs <= cash) aa.cash[i] = 100;
      else {
        let remPer = allocate(
          aa.cash,
          i,
          Math.round((mustAllocation.cash[y] / cs) * 100),
          100
        );
        if (remPer) aa.mtb[i] += remPer;
      }
      oom.push(y);
    }
    rate = getRR(aa, i, ffGoal.pp);
    rr.push(rate);
    if (v < 0) cs += v;
    if (cs > 0) cs *= 1 + rate / 100;
    if (v > 0) cs += v;
    if (ffYear === y && i === 0) ffAmt = ffGoal.ra as number;
    else if (y === ffYear - 1) ffAmt = cs;
    ffCfs[y] = Math.round(cs);
  }
  return {
    ffYear: ffYear,
    leftAmt: Math.round(cs),
    ffAmt: Math.round(ffAmt),
    ffCfs: ffCfs,
    minReq: minReq,
    aa: aa,
    rr: rr,
    oom: oom.length > 0 ? oom : null,
  };
};

const isOOMAfterFF = (ffYear: number, oom: Array<number>) => {
  for (let oomYear of oom) if (oomYear >= ffYear) return true;
  return false;
};

export const isFFPossible = (result: any, nomineeAmt: number) => {
  if (!result.ffYear || result.ffYear < 0) return false;
  return (
    result.ffAmt >= result.minReq &&
    result.leftAmt >= nomineeAmt &&
    (!result.oom || !isOOMAfterFF(result.ffYear, result.oom))
  );
};

export const findEarliestFFYear = (
  ffGoal: APIt.CreateGoalInput,
  mergedCFs: Object,
  yearToTry: number | undefined | null,
  mustCFs: Array<number>,
  tryCFs: Array<number>
) => {
  let nowYear = new Date().getFullYear();
  let lastPossibleFFYear = ffGoal.sy + (ffGoal.loan?.rate as number);
  if (nowYear > lastPossibleFFYear)
    return {
      ffYear: -1,
      leftAmt: -1,
      ffAmt: -1,
      ffCfs: {},
      minReq: -1,
      aa: {},
      rr: [],
      oom: [],
    };
  if (!yearToTry || yearToTry <= nowYear || yearToTry > lastPossibleFFYear)
    yearToTry = nowYear + Math.round((lastPossibleFFYear - nowYear) / 2);
  let nomineeAmt = ffGoal?.sa as number;
  let prevResult = checkForFF(ffGoal, yearToTry, mergedCFs, mustCFs, tryCFs);
  let increment = isFFPossible(prevResult, nomineeAmt) ? -1 : 1;
  for (
    let currYear = yearToTry + increment;
    currYear <= lastPossibleFFYear && currYear > nowYear;
    currYear += increment
  ) {
    let result = checkForFF(ffGoal, currYear, mergedCFs, mustCFs, tryCFs);
    if (
      !isFFPossible(result, nomineeAmt) &&
      isFFPossible(prevResult, nomineeAmt)
    )
      return prevResult;
    if (
      !isFFPossible(prevResult, nomineeAmt) &&
      isFFPossible(result, nomineeAmt)
    )
      return result;
    prevResult = result;
  }
  return prevResult;
};

export const getClosestTargetVal = (
  arr: Array<APIt.TargetInput>,
  num: number,
  defaultVal: number
) => {
  if (!arr || !arr.length) return defaultVal;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].num > num) return i ? arr[i - 1].val : defaultVal;
  }
  return arr[arr.length - 1].val;
};
