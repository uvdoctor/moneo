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
//Tested
export const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
  if (!val || val < 0 || !tr) return 0;
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

export const calculateTotalTaxBenefit = (
  goalType: APIt.GoalType,
  price: number,
  manualMode: number,
  duration: number,
  taxRate: number,
  maxTaxDL: number,
  priceChgRate: number = 0
) => {
  if (manualMode > 0) {
    return Math.round(getTaxBenefit(price, taxRate, maxTaxDL));
  }
  if (goalType === APIt.GoalType.B) {
    return Math.round(getTaxBenefit(price, taxRate, maxTaxDL));
  }
  let tb = 0;
  for (
    let i = 0, v = price;
    i < duration;
    i++, v = getCompoundedIncome(priceChgRate, price, i)
  ) {
    tb += getTaxBenefit(v, taxRate, maxTaxDL);
  }
  return Math.round(tb);
};

export const calculatePrincipalTaxBenefit = (
  goalType: APIt.GoalType,
  price: number,
  chgRate: number,
  manualMode: number,
  loanPer: number,
  loanInt: number,
  loanYears: number,
  loanRepaymentSY: number,
  startYear: number,
  endYear: number,
  duration: number,
  taxRate: number,
  maxTaxDL: number
) => {
  let loanBorrowAmt = getLoanBorrowAmt(
    price,
    goalType,
    manualMode,
    chgRate,
    endYear - startYear,
    loanPer
  ) as number;
  let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12);
  let annualInts = getIntAmtByYear(loanBorrowAmt, emi, loanInt, loanYears * 12);
  let taxBenefit = 0;
  for (
    let index = loanRepaymentSY - startYear, ly = loanYears;
    index < (duration < loanYears ? duration : loanYears);
    index++, ly--
  ) {
    let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12);
    let i = index - (loanRepaymentSY - startYear);
    taxBenefit += getTaxBenefit(
      annualEmiAmt - annualInts[i],
      taxRate,
      maxTaxDL
    );
  }
  let remPayment = getRemPrincipal(
    startYear,
    loanBorrowAmt,
    emi,
    loanInt,
    loanRepaymentSY,
    loanYears,
    duration
  );
  taxBenefit += getTaxBenefit(remPayment, taxRate, maxTaxDL);
  return taxBenefit;
};

export const calculateInterestTaxBenefit = (
  loanBorrowAmt: number,
  loanInt: number,
  loanYears: number,
  loanRepaymentSY: number,
  startYear: number,
  duration: number,
  taxRate: number,
  maxTaxDL: number
) => {
  let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12);
  let annualInts = getIntAmtByYear(loanBorrowAmt, emi, loanInt, loanYears * 12);
  let taxBenefit = 0;
  for (
    let index = loanRepaymentSY - startYear;
    index < (duration < loanYears ? duration : loanYears);
    index++
  ) {
    let i = index - (loanRepaymentSY - startYear);
    taxBenefit += getTaxBenefit(annualInts[i], taxRate, maxTaxDL);
  }
  return taxBenefit;
};

const createAutoCFs = (
  p: number,
  goal: APIt.CreateGoalInput,
  duration: number
) => {
  let cfs: Array<number> = [];
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
    cfs[1] += getTaxBenefit(p, goal.tdr, goal.tdl);
  } else {
    let taxBenefit = 0;
    for (
      let i = 0, v = p;
      i < duration;
      i++, v = getCompoundedIncome(goal.chg as number, p, i)
    ) {
      cfs.push(Math.round(-v + taxBenefit));
      taxBenefit = getTaxBenefit(v, goal.tdr, goal.tdl);
    }
    if (taxBenefit > 0) cfs.push(taxBenefit);
  }
  return cfs;
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
  console.log("XIRR cfs are ", xirrCFs);
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
  return p * ((loanPer as number) / 100);
};

export const getLoanPaidForMonths = (
  endYear: number,
  loanRepaymentYear: number,
  loanYears: number
) => {
  let totalMonths = loanYears * 12;
  let loanPaidForMonths = (endYear + 1 - loanRepaymentYear) * 12;
  return loanPaidForMonths < totalMonths ? loanPaidForMonths : totalMonths;
};

const createLoanCFs = (
  p: number,
  goal: APIt.CreateGoalInput,
  duration: number
) => {
  let cfs: Array<number> = [];
  if (!goal.emi?.per || !goal.emi?.dur || !goal.emi?.rate) return cfs;
  let loanBorrowAmt = getLoanBorrowAmt(
    p,
    goal.type,
    goal.manual,
    goal?.chg as number,
    goal.ey - goal.sy,
    goal.emi?.per
  );
  let loanDP = Math.round(loanBorrowAmt / (goal.emi.per / 100)) - loanBorrowAmt;
  for (let y = goal.sy; y < goal.emi?.ry; y++) {
    let intAmt = loanBorrowAmt * (goal.emi?.rate / 100);
    loanBorrowAmt += intAmt;
  }
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
    let cf = year === goal.sy ? loanDP : 0;
    cf -= taxBenefit;
    taxBenefit = 0;
    if (year >= (goal.emi?.ry as number) && ly > 0) {
      let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12);
      cf += annualEmiAmt;
      let i = year - (goal.emi?.ry as number);
      taxBenefit = getTaxBenefit(
        annualEmiAmt - annualInts[i],
        goal.tdr,
        goal.tdl
      );
      taxBenefit +=
        (goal.tbi as number) > 0
          ? getTaxBenefit(annualInts[i], goal.tdr, goal.tdli as number)
          : 0;
      ly--;
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
    cfs.push(cf ? Math.round(-cf) : 0);
  }
  if (goal.type === APIt.GoalType.B) {
    let remPayment = getRemPrincipal(
      goal.sy,
      loanBorrowAmt,
      emi,
      goal?.emi?.rate as number,
      goal?.emi?.ry as number,
      goal?.emi?.dur as number,
      duration
    );
    sp = calculateSellPrice(p, goal?.achg as number, duration);
    cfs.push(Math.round(sp + taxBenefit - remPayment));
    taxBenefit = getTaxBenefit(remPayment, goal.tdr, goal.tdl);
  }
  if (taxBenefit > 0) cfs.push(Math.round(taxBenefit));
  return cfs;
};

const getRemPrincipal = (
  startYear: number,
  loanBorrowAmt: number,
  emi: number,
  loanIntRate: number,
  loanRepaymentSY: number,
  loanYears: number,
  duration: number
) => {
  let ey = startYear + duration - 1;
  if (loanRepaymentSY + loanYears - 1 <= ey) return 0;
  let remPrincipal = loanBorrowAmt;
  if (ey >= loanRepaymentSY) {
    let loanPaidForMonths = getLoanPaidForMonths(
      ey,
      loanRepaymentSY,
      loanYears
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
  for (let i = 0; i < duration; i++) {
    let v = 0;
    if (i < targets.length) v = targets[i].val;
    let taxBenefit = getTaxBenefit(v, goal.tdr, goal.tdl);
    v -= taxBenefitPrev;
    taxBenefitPrev = taxBenefit;
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
    taxBenefitPrev = getTaxBenefit(remPayment, goal.tdr, goal.tdl);
  }
  if (taxBenefitPrev > 0) cfs.push(Math.round(taxBenefitPrev));
  return cfs;
};

const calculateCashAllocation = (
  ffGoal: APIt.CreateGoalInput,
  mustCFs: Array<number>,
  avgAnnualExpense: number,
  expChgRate: number,
  ffYear: number | null
) => {
  let nowYear = new Date().getFullYear();
  let savingsAA: any = {};
  let depositsAA: any = {};
  for (let year = nowYear + 1; year <= ffGoal.ey; year++) {
    let livingExp: number =
      !ffYear || year < ffYear
        ? Math.round(
            getCompoundedIncome(expChgRate, avgAnnualExpense, year - nowYear) /
              2
          )
        : getCompoundedIncome(
            ffGoal.btr as number,
            ffGoal.tbr as number,
            year - ffYear
          );
    savingsAA[year] = livingExp / 2;
    depositsAA[year] = livingExp / 2;
    let mustCF = mustCFs[year - (nowYear + 1)];
    depositsAA[year] -= mustCF < 0 ? mustCF : 0;
    let depCF = 0;
    for (let depYear = year + 1; depYear < year + 5; depYear++) {
      let mustCF = mustCFs[depYear - (nowYear + 1)];
      if (mustCF && mustCF < 0) depCF -= mustCF;
      if (ffYear && depYear >= ffYear) {
        depCF += getCompoundedIncome(
          ffGoal.btr as number,
          ffGoal.tbr as number,
          depYear - ffYear
        );
      }
    }
    depositsAA[year] += depCF;
  }
  return { savings: savingsAA, deposits: depositsAA };
};

const calculateBondAllocation = (
  ffGoal: APIt.CreateGoalInput,
  tryCFs: Array<number>
) => {
  let nowYear = new Date().getFullYear();
  let stbondAA: any = {};
  for (let year = nowYear + 1; year <= ffGoal.ey; year++) {
    let cf = 0;
    for (let bondYear = year; bondYear < year + 3; bondYear++) {
      let tryCF = tryCFs[bondYear - (nowYear + 1)];
      if (tryCF && tryCF < 0) cf -= tryCF;
    }
    stbondAA[year] = cf;
  }
  return stbondAA;
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
  ba: number,
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
  aa[ASSET_TYPES.SAVINGS][i] = savingsPer;
  aa[ASSET_TYPES.DEPOSITS][i] = depPer;
  let bondsPer = cs > sa + da ? Math.round((ba / cs) * 100) : 0;
  if (bondsPer + cashPer > 100) bondsPer = 100 - cashPer;
  if (y < ffYear)
    aa[ASSET_TYPES.TAX_EXEMPT_BONDS][i] = Math.round(bondsPer * 0.5);
  aa[ASSET_TYPES.MED_TERM_BONDS][i] =
    bondsPer - aa[ASSET_TYPES.TAX_EXEMPT_BONDS][i];
  let remPer = 100 - (cashPer + bondsPer);
  if (remPer > 0) {
    let reitPer = ffGoal.imp === APIt.LMH.L ? 10 : 5;
    if (y >= ffYear) {
      if (y > ffGoal.ey - 5) reitPer = 25;
      else if (y >= ffGoal.ey - 20) reitPer = 20;
      else reitPer += 5;
    }
    if (reitPer > remPer) reitPer = remPer;
    aa[ASSET_TYPES.DOMESTIC_REIT][i] = Math.round(reitPer * 0.8);
    aa[ASSET_TYPES.INTERNATIONAL_REIT][i] =
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
            aa[ASSET_TYPES.DIVIDEND_GROWTH_STOCKS][i] = stocksPer;
          else if (y >= ffGoal.ey - 20) {
            aa[ASSET_TYPES.DIVIDEND_GROWTH_STOCKS][i] =
              ((100 - 2 * (ffGoal.ey - y)) / 100) * stocksPer;
            aa[ASSET_TYPES.LARGE_CAP_STOCKS][i] =
              stocksPer - aa[ASSET_TYPES.DIVIDEND_GROWTH_STOCKS][i];
          } else {
            if (ffGoal.imp === APIt.LMH.M || y >= ffYear) {
              aa[ASSET_TYPES.LARGE_CAP_STOCKS][i] = Math.round(stocksPer * 0.7);
              aa[ASSET_TYPES.INTERNATIONAL_STOCKS][i] =
                stocksPer - aa[ASSET_TYPES.LARGE_CAP_STOCKS][i];
            } else {
              aa[ASSET_TYPES.DIGITAL_CURRENCIES][i] = 1;
              aa[ASSET_TYPES.MID_CAP_STOCKS][i] = Math.round(
                (stocksPer - 1) * 0.7
              );
              aa[ASSET_TYPES.INTERNATIONAL_STOCKS][i] =
                stocksPer - 1 - aa[ASSET_TYPES.MID_CAP_STOCKS][i];
            }
          }
          remPer -= stocksPer;
          if (remPer > 0) {
            let goldPer = Math.round(stocksPer * 0.1);
            if (goldPer > remPer) goldPer = remPer;
            aa[ASSET_TYPES.GOLD][i] = goldPer;
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

const checkForFF = (
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
    mCFs[index] ? (mCFs[nowYear + 1 + i] += cf) : (mCFs[index] = cf);
  });
  let ffAmt = 0;
  let ffCfs = {};
  let cash = calculateCashAllocation(
    ffGoal,
    mustCFs,
    avgAnnualExpense,
    expChgRate,
    ffYear
  );
  let bonds = calculateBondAllocation(ffGoal, tryCFs);
  let aa: any = buildEmptyAA(nowYear + 1, ffGoal.ey);
  let rr: Array<number> = [];
  let minReq = 0;
  let oom = [];
  for (let [year, value] of Object.entries(mCFs)) {
    let y = parseInt(year);
    if (y > ffGoal.ey) break;
    let v = parseInt(value);
    let sa = cash.savings[y] ? parseFloat(cash.savings[y]) : 0;
    let da = cash.deposits[y] ? parseFloat(cash.deposits[y]) : 0;
    let ba = bonds[y] ? parseInt(bonds[y]) : 0;
    minReq = y < ffYear ? sa + da : sa + da + ba;
    let i = y - (nowYear + 1);
    let rate = 0;
    if (cs >= minReq) {
      calculateAllocation(ffGoal, y, cs, aa, sa, da, ba, ffYear);
    } else {
      if (cs <= sa) aa[ASSET_TYPES.SAVINGS][i] = 100;
      else {
        aa[ASSET_TYPES.SAVINGS][i] = Math.round((sa / cs) * 100);
        let depPer = Math.round((da / cs) * 100);
        let remPer = 100 - aa[ASSET_TYPES.SAVINGS][i];
        aa[ASSET_TYPES.DEPOSITS][i] = depPer < remPer ? depPer : remPer;
        remPer -= aa[ASSET_TYPES.DEPOSITS][i];
        if (remPer > 0) aa[ASSET_TYPES.MED_TERM_BONDS][i] = remPer;
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
  if (nowYear > ffGoal.ey - 30)
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
  if (!yearToTry || yearToTry <= nowYear || yearToTry > ffGoal.ey - 30)
    yearToTry = nowYear + Math.round((ffGoal.ey - 30 - nowYear) / 2);
  //@ts-ignore
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
  let increment =
    prevResult.ffAmt >= prevResult.minReq &&
    prevResult.leftAmt >= nomineeAmt &&
    !prevResult.oom
      ? -1
      : 1;
  for (
    let currYear = yearToTry + increment;
    currYear <= ffGoal.ey - 30 && currYear > nowYear;
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
      (result.leftAmt < nomineeAmt ||
        result.ffAmt < result.minReq ||
        result.oom) &&
      prevResult.leftAmt >= nomineeAmt &&
      prevResult.ffAmt >= prevResult.minReq &&
      !prevResult.oom
    )
      return prevResult;
    else if (
      (prevResult.leftAmt < nomineeAmt ||
        prevResult.ffAmt < prevResult.minReq ||
        prevResult.oom) &&
      result.ffAmt >= result.minReq &&
      result.leftAmt >= nomineeAmt &&
      !result.oom
    )
      return result;
    prevResult = result;
  }
  return prevResult;
};
