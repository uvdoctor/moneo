import * as APIt from "../../api/goals";
import {
  getIntAmtByYear,
  getRemainingPrincipal,
  getCompoundedIncome,
  getEmi,
} from "../calc/finance";
import xirr from "xirr";
import { buildArray, getAllAssetTypes } from "../utils";
import { ASSET_TYPES } from "../../CONSTANTS";
import { getLastPossibleFFYear, getMinRetirementDuration, isTaxCreditEligible } from "./goalutils";
//Tested
export const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
  if (!val || val < 0 || !tr || (tr === 100 && maxTaxDL === 0)) return 0;
  if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL;
  return Math.round(val * (tr / 100));
};

const calculateBuyAnnualNetCF = (
  startYear: number,
  amCostPer: number,
  amStartYear: number,
  chgRate: number,
  index: number,
  p: number,
  aiPer: number,
  aiSY: number
) => {
  let annualNetCF = 0;
  let yearlyPrice = index === 0 ? p : getCompoundedIncome(chgRate, p, index);
  if (startYear + index >= amStartYear)
    annualNetCF -= yearlyPrice * (amCostPer / 100);
  if (startYear + index >= aiSY) annualNetCF += yearlyPrice * (aiPer / 100);
  return Math.round(annualNetCF);
};
//Tested
export const calculateTotalAmt = (
  startYear: number,
  annualPer: number,
  annualSY: number,
  price: number,
  chgRate: number,
  duration: number
) => {
  let ta = 0;
  for (let i = 0; i < duration; i++) {
    if (startYear + i < annualSY) continue;
    let yearlyPrice = i === 0 ? price : getCompoundedIncome(chgRate, price, i);
    ta += yearlyPrice * (annualPer / 100);
  }
  return Math.round(ta);
};
//Tested
export const calculateSellPrice = (
  price: number,
  chgRate: number,
  duration: number
) => {
  return Math.round(getCompoundedIncome(chgRate, price, duration));
};

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
  duration: number
) => {
  if (price === null) price = calculatePrice(goal); //tested
  if ((goal?.manual as number) > 0)
    return createManualCFs(price, goal, duration);
  else if ((goal?.emi?.per as number) > 0)
    return createLoanCFs(price, goal, duration);
  else return createAutoCFs(price, goal, duration);
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

export const calculateFFCFs = (
  g: APIt.CreateGoalInput,
  annualSavings: number,
  ffYear: number
) => {
  let cfs: Array<number> = [];
  let nowYear = new Date().getFullYear();
  let duration = ffYear - (nowYear + 1);
  for (let i = 1; i <= duration; i++) {
    let val = getCompoundedIncome((g.tbr as number) * 12, annualSavings, i, 12);
    cfs.push(Math.round(val));
  }
  for (let year = ffYear; year <= g.ey; year++) {
    let cf =
      getCompoundedIncome(
        g.btr as number,
        g.tdli as number,
        year - (g.sy + 1)
      ) *
      (1 + g.tdr / 100);
    cfs.push(Math.round(-cf));
  }
  //@ts-ignore
  if ((g?.cp as number) > 0 && nowYear < g.amsy + g.achg) {
    //@ts-ignore
    let premiumYear = nowYear >= g.amsy ? nowYear + 1 : g.amsy;
    //@ts-ignore
    for (let year = premiumYear; year < g.amsy + g.achg; year++) {
      //@ts-ignore
      let premium = getCompoundedIncome(g.amper, g.cp, year - (g.chg + 1));
      //@ts-ignore
      let index = cfs.length - 1 - (g.ey - year);
      cfs[index] -= premium;
      cfs[index + 1] += getTaxBenefit(premium, g.tdr, g.tdl);
    }
  }
  //@ts-ignore
  if (g?.tbi > 0) {
    //@ts-ignore
    let incomeYear = nowYear >= g.aisy ? nowYear + 1 : g.aisy;
    //@ts-ignore
    for (let year = incomeYear; year <= g.ey; year++) {
      //@ts-ignore
      let income = getCompoundedIncome(g.aiper, g.tbi, year - incomeYear);
      //@ts-ignore
      let index = cfs.length - 1 - (g.ey - year);
      cfs[index] += income;
    }
  }
  g.pg?.forEach((t) => {
    //@ts-ignore
    let index = cfs.length - 1 - (g.ey - t?.year);
    cfs[index] += t?.val as number;
  });
  g.pl?.forEach((t) => {
    //@ts-ignore
    let index = cfs.length - 1 - (g.ey - t?.year);
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
      goal.amper as number,
      goal.amsy as number,
      goal.achg as number,
      0,
      p,
      goal.aiper as number,
      goal.aisy as number
    );
    cfs.push(Math.round(netAnnualAmt));
  }
  cfs.push(calculateSellPrice(p, goal?.achg as number, duration));
  return cfs;
};

const createAutoCFs = (
  p: number,
  goal: APIt.CreateGoalInput,
  duration: number
) => {
  let cfs: Array<number> = [];
  let totalTaxBenefit = 0;
  if (goal.type === APIt.GoalType.B && duration) {
    let netAnnualAmt = calculateBuyAnnualNetCF(
      goal.sy,
      goal.amper as number,
      goal.amsy as number,
      goal.achg as number,
      0,
      p,
      goal.aiper as number,
      goal.aisy as number
    );
    let v = Math.round(p - netAnnualAmt);
    cfs.push(v ? -v : 0);
    for (let i = 1; i < duration; i++)
      cfs.push(
        calculateBuyAnnualNetCF(
          goal.sy,
          goal.amper as number,
          goal.amsy as number,
          goal.achg as number,
          i,
          p,
          goal.aiper as number,
          goal.aisy as number
        )
      );
    cfs.push(calculateSellPrice(p, goal?.achg as number, duration));
    let tb = getTaxBenefit(
      p,
      isTaxCreditEligible(goal.type) ? 100 : goal.tdr,
      goal.tdl
    );
    cfs[1] += tb;
    totalTaxBenefit += tb;
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

export const calculateXIRR = (
  cfs: Array<number>,
  startYear: number,
  price: number,
  sellAfter: number,
  sellPrice: number
) => {
  if (!price || !sellPrice || !cfs) return null;
  let xirrCFs: Array<any> = [];
  let addSellCF = false;
  cfs.forEach((cf, i) => {
    if (i === sellAfter && cf < 0) {
      cf -= sellPrice;
      addSellCF = true;
    }
    xirrCFs.push({
      amount: cf,
      when: new Date(startYear + i, 0, 1),
    });
  });
  if (addSellCF) {
    xirrCFs.push({
      amount: Math.round(sellPrice),
      when: new Date(startYear + sellAfter, 1, 1),
    });
  }
  try {
    return xirr(xirrCFs) * 100;
  } catch (e) {
    console.log("Error while calculating xirr: ", e);
    return null;
  }
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
  if (goalType !== APIt.GoalType.B && !manualMode) {
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

export const getLoanPaidForMonths = (
  endYear: number,
  loanRepaymentYear: number,
  loanYears: number,
) => {
  if(!endYear || !loanRepaymentYear || loanRepaymentYear >= endYear) return loanYears * 12
  let loanPaidYears = endYear + 1 - loanRepaymentYear 
  if(loanPaidYears > loanYears) loanPaidYears = loanYears;
  return loanPaidYears * 12;
};

export const adjustAccruedInterest = (
  loanBorrowAmt: number,
  startYear: number,
  repaymentSY: number,
  loanRate: number
) => {
  for (let y = startYear; y < repaymentSY; y++) {
    let intAmt = loanBorrowAmt * (loanRate / 100);
    loanBorrowAmt += intAmt;
  }
  return loanBorrowAmt;
};

export const createEduLoanDPWithSICFs = (
  price: number,
  chgRate: number,
  loanPer: number,
  startYear: number,
  endYear: number,
  intRate: number,
  intPer: number,
  capitalizeRem: boolean = false
) => {
  let result: Array<number> = [];
  let totalLoanPrincipal = 0;
  let ints: Array<number> = [];
  let remIntAmt = 0;
  for (let y = startYear; y <= endYear; y++) {
    let p = getCompoundedIncome(chgRate, price, y - startYear);
    totalLoanPrincipal += p * (loanPer / 100);
    let dp = p * (1 - loanPer / 100);
    let totalIntDue = totalLoanPrincipal * (intRate / 100);
    let interestPaid = totalIntDue * (intPer / 100);
    result.push(Math.round(dp + interestPaid));
    ints.push(interestPaid);
    remIntAmt += totalIntDue - interestPaid;
    if (y === endYear && capitalizeRem) {
      totalLoanPrincipal += remIntAmt;
      remIntAmt = 0;
    }
  }
  return {
    borrowAmt: totalLoanPrincipal,
    cfs: result,
    ints: ints,
    remIntAmt: remIntAmt,
  };
};

export const calculateEduLoanGracePeriodInt = (loanPrincipal: number, rate: number) => {
  loanPrincipal * (rate / 200)
}

const createLoanCFs = (
  p: number,
  goal: APIt.CreateGoalInput,
  duration: number
) => {
  let cfs: Array<number> = [];
  let totalPTaxBenefit = 0;
  let totalITaxBenefit = 0;
  if (!goal.emi?.per || !goal.emi?.dur) return cfs;
  let loanBorrowAmt = 0;
  let loanDP = 0;
  let simpleInts: Array<number> = [];
  let remSimpleIntAmt = 0;
  if (goal.type !== APIt.GoalType.E) {
    loanBorrowAmt = getLoanBorrowAmt(
      p,
      goal.type,
      goal.manual,
      goal?.chg as number,
      goal.ey - goal.sy,
      goal.emi?.per
    );
    loanDP = Math.round(loanBorrowAmt / (goal.emi.per / 100)) - loanBorrowAmt;
    cfs.push(loanDP);
  } else {
    let result = createEduLoanDPWithSICFs(
      p,
      goal.chg as number,
      goal.emi?.per,
      goal.sy,
      goal.ey,
      goal.emi?.rate,
      goal.btr as number,
      goal.tbr as number < 1
    );
    cfs = result.cfs;
    loanBorrowAmt = result.borrowAmt;
    simpleInts = result.ints;
    remSimpleIntAmt = result.remIntAmt;
  }
  loanBorrowAmt = adjustAccruedInterest(
    loanBorrowAmt,
    goal.type === APIt.GoalType.E ? goal.ey + 1 : goal.sy,
    goal.emi.ry,
    goal.emi.rate
  );
  let emi = Math.round(
    getEmi(loanBorrowAmt, goal.emi?.rate, goal.emi?.dur * 12)
  );
  let annualInts = getIntAmtByYear(
    loanBorrowAmt,
    emi,
    goal.emi?.rate,
    goal.emi?.dur * 12
  );
  let ey = goal.sy + duration - 1;
  let sp = 0;
  let taxBenefit = 0;
  for (let year = goal.sy, ly = goal.emi?.dur as number; year <= ey; year++) {
    let index = year - goal.sy;
    let cf = cfs[index] ? cfs[index] : 0;
    cf -= taxBenefit;
    taxBenefit = 0;
    if (year >= goal.emi.ry && ly > 0) {
      let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12);
      cf += annualEmiAmt;
      let i = year - goal.emi.ry;
      if (!isTaxCreditEligible(goal.type)) {
        if (goal.type !== APIt.GoalType.E)
          taxBenefit = getTaxBenefit(
            annualEmiAmt - annualInts[i],
            goal.tdr,
            goal.tdl
          );
        totalPTaxBenefit += taxBenefit;
        let itb =
          (goal.tbi as number) > 0
            ? getTaxBenefit(annualInts[i], goal.tdr, goal.tdli as number)
            : 0;
        taxBenefit += itb;
        totalITaxBenefit += itb;
      }
      ly--;
    } else if (
      year < goal.emi.ry &&
      (goal.tbi as number) > 0 &&
      simpleInts[index]
    ) {
      taxBenefit = getTaxBenefit(
        simpleInts[index],
        goal.tdr,
        goal.tdli as number
      );
      totalITaxBenefit += taxBenefit;
    }
    if(goal.type === APIt.GoalType.E && year === goal.ey + 1) {
      cf += remSimpleIntAmt
    }
    if (goal.type === APIt.GoalType.B) {
      cf -= calculateBuyAnnualNetCF(
        goal.sy,
        goal.amper as number,
        goal.amsy as number,
        goal.achg as number,
        year - goal.sy,
        p,
        goal.aiper as number,
        goal.aisy as number
      );
    }
    if (isTaxCreditEligible(goal.type)) {
      let ptb = getTaxBenefit(cf, 100, goal.tdl);
      taxBenefit += ptb;
      totalPTaxBenefit += ptb;
    }
    if (cfs[year - goal.sy]) cfs[year - goal.sy] = Math.round(-cf);
    else cfs.push(cf ? Math.round(-cf) : 0);
  }
  if (goal.type === APIt.GoalType.B) {
    let remPayment = getRemPrincipal(
      goal.sy,
      loanBorrowAmt,
      emi,
      goal?.emi?.rate as number,
      goal?.emi?.ry as number,
      goal?.emi?.dur as number,
      duration,
    );
    sp = calculateSellPrice(p, goal?.achg as number, duration);
    cfs.push(Math.round(sp + taxBenefit - remPayment));
    taxBenefit = getTaxBenefit(remPayment, goal.tdr, goal.tdl);
    totalPTaxBenefit += taxBenefit;
  }
  if (taxBenefit > 0) cfs.push(Math.round(taxBenefit));
  return { cfs: cfs, ptb: totalPTaxBenefit, itb: totalITaxBenefit };
};

const getRemPrincipal = (
  startYear: number,
  loanBorrowAmt: number,
  emi: number,
  loanIntRate: number,
  loanRepaymentSY: number,
  loanYears: number,
  duration: number,
) => {
  let ey = startYear + duration - 1;
  if (loanRepaymentSY + loanYears - 1 <= ey) return 0;
  let remPrincipal = loanBorrowAmt;
  if (ey >= loanRepaymentSY) {
    let loanPaidForMonths = getLoanPaidForMonths(
      ey,
      loanRepaymentSY,
      loanYears,
    );
    remPrincipal = getRemainingPrincipal(
      loanBorrowAmt,
      emi,
      loanIntRate,
      loanPaidForMonths
    );
  }
  return remPrincipal;
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
          goal?.amper as number,
          goal?.amsy as number,
          goal?.achg as number,
          i,
          p,
          goal.aiper as number,
          goal.aisy as number
        )
      );
    cfs.push(v ? -v : 0);
  }
  if (goal.type === APIt.GoalType.B) {
    let remPayment = 0;
    if (duration <= goal.ey - goal.sy) {
      for (let i = duration; i < goal.ey; i++) {
        if (targets[i]) remPayment += targets[i].val;
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
  avgAnnualExpense: number,
  expChgRate: number,
  ffYear: number | null
) => {
  let nowYear = new Date().getFullYear();
  let savingsAA: any = {};
  let depositsAA: any = {};
  let bondsAA: any = {};
  for (let year = nowYear + 1; year <= ffGoal.ey; year++) {
    let livingExp: number =
      !ffYear || year < ffYear
        ? Math.round(
            getCompoundedIncome(expChgRate, avgAnnualExpense, year - nowYear) /
              2
          )
        : getCompoundedIncome(
            ffGoal.btr as number,
            ffGoal.tdli as number,
            year - ffYear
          );
    savingsAA[year] = livingExp / 2;
    depositsAA[year] = livingExp / 2;
    let mustCF = mustCFs[year - (nowYear + 1)];
    if (mustCF && mustCF < 0) depositsAA[year] -= mustCF;
    let depCF = 0;
    let bondsCF = 0;
    for (let futureYear = year + 1; futureYear < year + 5; futureYear++) {
      let cf = 0;
      let mustCF = mustCFs[futureYear - (nowYear + 1)];
      if (mustCF && mustCF < 0) cf -= mustCF;
      if (ffYear && futureYear >= ffYear) {
        cf += getCompoundedIncome(
          ffGoal.btr as number,
          ffGoal.tdli as number,
          futureYear - ffYear
        );
      }
      if (futureYear === year + 1) depCF += cf;
      else bondsCF += cf;
    }
    depositsAA[year] += depCF;
    bondsAA[year] = bondsCF;
  }
  return { savings: savingsAA, deposits: depositsAA, bonds: bondsAA };
};

const calculateTryAllocation = (
  ffGoal: APIt.CreateGoalInput,
  tryCFs: Array<number>
) => {
  let nowYear = new Date().getFullYear();
  let bondAA: any = {};
  for (let year = nowYear + 1; year <= ffGoal.ey; year++) {
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
  let aa: any = {};
  getAllAssetTypes().forEach((key) => (aa[key] = buildArray(fromYear, toYear)));
  return aa;
};

const getRR = (aa: any, index: number, pp: any) => {
  let perf = 0;
  for (const prop in aa) {
    //@ts-ignore
    perf += (pp[prop] * aa[prop][index]) / 100;
  }
  return perf;
};

const calculateAllocation = (
  ffGoal: APIt.CreateGoalInput,
  y: number,
  cs: number,
  aa: any,
  sa: number,
  da: number,
  mustBA: number,
  tryBA: number,
  ffYear: number
) => {
  let nowYear = new Date().getFullYear();
  let i = y - (nowYear + 1);
  let savingsPer = Math.round((sa / cs) * 100);
  let depPer = Math.round((da / cs) * 100);
  let cashPer = savingsPer + depPer;
  if (y >= ffGoal.ey - 10) {
    let maxCashPer = 30 - 2 * (ffGoal.ey - y);
    if (cashPer < maxCashPer) cashPer = maxCashPer;
    depPer = cashPer - savingsPer;
  }
  aa[ASSET_TYPES.SAVINGS][i] += savingsPer;
  aa[ASSET_TYPES.DEPOSITS][i] += depPer;
  let remPer = 100 - cashPer;
  let mustBondsPer = remPer > 0 ? Math.round((mustBA / cs) * 100) : 0;
  if (mustBondsPer > remPer) mustBondsPer = remPer;
  if (y < ffYear) aa[ASSET_TYPES.TAX_EXEMPT_BONDS][i] += mustBondsPer;
  else aa[ASSET_TYPES.MED_TERM_BONDS][i] += mustBondsPer;
  remPer -= mustBondsPer;
  let tryBondsPer = remPer > 0 ? Math.round((tryBA / cs) * 100) : 0;
  if (tryBondsPer > remPer) tryBondsPer = remPer;
  aa[ASSET_TYPES.MED_TERM_BONDS][i] += tryBondsPer;
  remPer -= tryBondsPer;
  if (remPer > 0) {
    let reitPer = ffGoal.imp === APIt.LMH.L ? 10 : 5;
    if (y >= ffYear) {
      if (y > ffGoal.ey - 5) reitPer = 25;
      else if (y >= ffGoal.ey - 20) reitPer = 20;
      else reitPer += 5;
    }
    if (reitPer > remPer) reitPer = remPer;
    aa[ASSET_TYPES.DOMESTIC_REIT][i] += Math.round(reitPer * 0.8);
    aa[ASSET_TYPES.INTERNATIONAL_REIT][i] +=
      reitPer - aa[ASSET_TYPES.DOMESTIC_REIT][i];
    remPer -= reitPer;
    if (remPer > 0) {
      if (y <= ffGoal.ey - 5) {
        if (ffGoal.imp === APIt.LMH.L) {
          let mteBondsPer = 0;
          if (y < ffYear) mteBondsPer = Math.round(remPer * 0.5);
          aa[ASSET_TYPES.TAX_EXEMPT_BONDS][i] += mteBondsPer;
          aa[ASSET_TYPES.MED_TERM_BONDS][i] += remPer - mteBondsPer;
        } else {
          let stocksPer = Math.round(remPer * 0.9);
          let maxStocksPer =
            y >= ffGoal.ey - 20 ? 2 * (ffGoal.ey - y) : 120 - (ffGoal.ey - y);
          if (y >= ffYear && maxStocksPer > 60) maxStocksPer = 60;
          if (stocksPer > maxStocksPer) stocksPer = maxStocksPer;
          if (y >= ffGoal.ey - 10)
            aa[ASSET_TYPES.DIVIDEND_GROWTH_STOCKS][i] += stocksPer;
          else if (y >= ffGoal.ey - 20) {
            aa[ASSET_TYPES.DIVIDEND_GROWTH_STOCKS][i] +=
              ((100 - 2 * (ffGoal.ey - y)) / 100) * stocksPer;
            aa[ASSET_TYPES.LARGE_CAP_STOCKS][i] +=
              stocksPer - aa[ASSET_TYPES.DIVIDEND_GROWTH_STOCKS][i];
          } else {
            if (ffGoal.imp === APIt.LMH.M || y >= ffYear) {
              aa[ASSET_TYPES.LARGE_CAP_STOCKS][i] += Math.round(
                stocksPer * 0.7
              );
              aa[ASSET_TYPES.INTERNATIONAL_STOCKS][i] +=
                stocksPer - aa[ASSET_TYPES.LARGE_CAP_STOCKS][i];
            } else {
              aa[ASSET_TYPES.DIGITAL_CURRENCIES][i] += 1;
              aa[ASSET_TYPES.MID_CAP_STOCKS][i] += Math.round(
                (stocksPer - 1) * 0.7
              );
              aa[ASSET_TYPES.INTERNATIONAL_STOCKS][i] +=
                stocksPer - 1 - aa[ASSET_TYPES.MID_CAP_STOCKS][i];
            }
          }
          remPer -= stocksPer;
          if (remPer > 0) {
            let goldPer = Math.round(stocksPer * 0.1);
            if (goldPer > remPer) goldPer = remPer;
            aa[ASSET_TYPES.GOLD][i] += goldPer;
            remPer -= goldPer;
          }
          if (remPer > 0) {
            let mteBondsPer = 0;
            if (y < ffYear) mteBondsPer = Math.round(remPer / 2);
            aa[ASSET_TYPES.TAX_EXEMPT_BONDS][i] += mteBondsPer;
            aa[ASSET_TYPES.MED_TERM_BONDS][i] += remPer - mteBondsPer;
          }
        }
      } else {
        aa[ASSET_TYPES.SHORT_TERM_BONDS][i] += remPer;
      }
    }
  }
};

export const checkForFF = (
  savings: number,
  ffGoal: APIt.CreateGoalInput,
  ffYear: number,
  mergedCFs: Object,
  annualSavings: number,
  mustCFs: Array<number>,
  tryCFs: Array<number>,
  avgAnnualExpense: number,
  expChgRate: number,
  pp: any
) => {
  let goal = Object.assign({}, ffGoal);
  let mCFs = Object.assign({}, mergedCFs);
  let cs = savings;
  let cfs: Array<number> = calculateFFCFs(goal, annualSavings, ffYear);
  let nowYear = new Date().getFullYear();
  cfs.forEach((cf, i) => {
    let index = nowYear + 1 + i;
    //@ts-ignore
    mCFs[index] ? (mCFs[index] += cf) : (mCFs[index] = cf);
  });
  let ffAmt = 0;
  let ffCfs = {};
  let mustAllocation = calculateMustAllocation(
    ffGoal,
    mustCFs,
    avgAnnualExpense,
    expChgRate,
    ffYear
  );
  let tryAllocation = calculateTryAllocation(ffGoal, tryCFs);
  let aa: any = buildEmptyAA(nowYear + 1, ffGoal.ey);
  let rr: Array<number> = [];
  let minReq = 0;
  let oom = [];
  for (let [year, value] of Object.entries(mCFs)) {
    let y = parseInt(year);
    if (y > ffGoal.ey) break;
    let v = parseInt(value);
    let sa = mustAllocation.savings[y];
    let da = mustAllocation.deposits[y];
    let mustBA = mustAllocation.bonds[y];
    let tryBA = tryAllocation[y];
    minReq = sa + da + mustBA;
    if (y >= ffYear) minReq += tryBA;
    let i = y - (nowYear + 1);
    let rate = 0;
    if (cs >= minReq) {
      calculateAllocation(ffGoal, y, cs, aa, sa, da, mustBA, tryBA, ffYear);
    } else {
      if (cs <= sa) aa[ASSET_TYPES.SAVINGS][i] = 100;
      else {
        aa[ASSET_TYPES.SAVINGS][i] = Math.round((sa / cs) * 100);
        let depPer = Math.round((da / cs) * 100);
        let remPer = 100 - aa[ASSET_TYPES.SAVINGS][i];
        aa[ASSET_TYPES.DEPOSITS][i] = depPer < remPer ? depPer : remPer;
        remPer -= aa[ASSET_TYPES.DEPOSITS][i];
        if (remPer > 0) {
          if (y >= ffYear) aa[ASSET_TYPES.MED_TERM_BONDS][i] = remPer;
          else aa[ASSET_TYPES.TAX_EXEMPT_BONDS][i] = remPer;
        }
      }
      oom.push(y);
    }
    rate = getRR(aa, i, pp);
    rr.push(rate);
    if (v < 0) cs += v;
    if (cs > 0) cs *= 1 + rate / 100;
    if (v > 0) cs += v;
    if (ffYear === y && i === 0) ffAmt = savings;
    else if (y === ffYear - 1) ffAmt = cs;
    //@ts-ignore
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
  savings: number,
  mergedCFs: Object,
  annualSavings: number,
  yearToTry: number | undefined | null,
  mustCFs: Array<number>,
  tryCFs: Array<number>,
  avgAnnualExpense: number,
  expChgRate: number,
  pp: any
) => {
  let nowYear = new Date().getFullYear();
  let lastPossibleFFYear = getLastPossibleFFYear(ffGoal.ey)
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
  let prevResult = checkForFF(
    savings,
    ffGoal,
    yearToTry,
    mergedCFs,
    annualSavings,
    mustCFs,
    tryCFs,
    avgAnnualExpense,
    expChgRate,
    pp
  );
  let increment = isFFPossible(prevResult, nomineeAmt) ? -1 : 1;
  for (
    let currYear = yearToTry + increment;
    currYear <= lastPossibleFFYear && currYear > nowYear;
    currYear += increment
  ) {
    let result = checkForFF(
      savings,
      ffGoal,
      currYear,
      mergedCFs,
      annualSavings,
      mustCFs,
      tryCFs,
      avgAnnualExpense,
      expChgRate,
      pp
    );
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
