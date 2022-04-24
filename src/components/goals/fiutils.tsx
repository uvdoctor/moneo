import { CreateGoalInput, LMH } from "../../api/goals";
import { appendValue, getFXRate } from "../utils";
import { findEarliestFFYear, isFFPossible } from "./cfutils";

const populateWithZeros = (firstYear: number, lastYear: number) => {
  let cfs: Array<number> = [];
  for (let year = firstYear; year <= lastYear; year++) {
    cfs.push(0);
  }
  return cfs;
};

const getCurrencyFactor = (
  fxRates: any,
  currency: string,
  defaultCurrency: string
) => {
  if (!fxRates) return 1;
  return getFXRate(fxRates, defaultCurrency) / getFXRate(fxRates, currency);
};

const populateData = (
  totalCfs: Array<number>,
  cfs: Array<number>,
  sy: number,
  firstYear: number,
  goalCurrency: string,
  defaultCurrency: string,
  fxRates: any
) => {
  let firstIndex = sy - firstYear;
  let currencyFactor = getCurrencyFactor(
    fxRates,
    goalCurrency,
    defaultCurrency
  );
  cfs.forEach((cf, i) => {
    if (firstIndex + i >= 0) totalCfs[firstIndex + i] += cf * currencyFactor;
  });
};

const mergeCFs = (
  obj: Object,
  cfs: Array<number>,
  sy: number,
  goalCurrency: string,
  defaultCurrency: string,
  fxRates: any
) => {
  let currencyFactor = getCurrencyFactor(
    fxRates,
    goalCurrency,
    defaultCurrency
  );
  cfs.forEach((cf, i) => {
    let year = sy + i;
    appendValue(obj, year, cf * currencyFactor);
  });
};

const getYearRange = (
  ffGoal: CreateGoalInput,
  allGoals: Array<CreateGoalInput>,
  allCFs: any
) => {
  const nowYear = new Date().getFullYear();
  let fromYear = nowYear + 1;
  if (!ffGoal || !allGoals || !allGoals[0])
    return { from: fromYear, to: fromYear };
  let toYear = nowYear + 1;
  allGoals.forEach((g) => {
    let endYear = g.sy + allCFs[g.id as string].length;
    if (endYear > toYear) toYear = endYear;
  });
  let ffGoalEndYear = ffGoal.sy + (ffGoal.loan?.dur as number);
  if (toYear > ffGoalEndYear) toYear = ffGoalEndYear;
  return { from: fromYear, to: toYear };
};

const buildEmptyMergedCFs = (
  ffGoal: CreateGoalInput,
  fromYear: number,
  toYear: number
) => {
  if (!ffGoal) return {};
  let mCFs: any = {};
  let ffToYear = ffGoal.sy + (ffGoal.loan?.dur as number);
  if (toYear < ffToYear) toYear = ffToYear;
  for (let year = fromYear; year <= toYear; year++) mCFs[year] = 0;
  return mCFs;
};

export const calculateFI = (
  ffGoal: CreateGoalInput,
  ffYear: number | null,
  allGoals: Array<CreateGoalInput>,
  allCFs: any,
  isPublicCalc: boolean,
  defaultCurrency: string,
  fxRates: any
) => {
  if (!ffGoal) return;
  let yearRange = getYearRange(ffGoal, allGoals, allCFs);
  let mustCFs = populateWithZeros(yearRange.from, yearRange.to);
  let tryCFs = populateWithZeros(yearRange.from, yearRange.to);
  let optCFs = populateWithZeros(yearRange.from, yearRange.to);
  let mCFs = buildEmptyMergedCFs(
    ffGoal,
    yearRange.from,
    ffGoal.sy + (ffGoal.loan?.dur as number)
  );
  if (isPublicCalc)
    return {
      mustCFs,
      tryCFs,
      optCFs,
      mergedCFs: mCFs,
      oppCostCache: {},
      ffResult: null,
      ffYear: null,
      rr: [],
      aa: {},
    };
  allGoals?.forEach((g) => {
    let cfs: Array<number> = allCFs[g.id as string];
    if (!cfs) return;
    if (g.imp === LMH.H)
      populateData(
        mustCFs,
        cfs,
        g.sy,
        yearRange.from,
        g.ccy,
        defaultCurrency,
        fxRates
      );
    else if (g.imp === LMH.M)
      populateData(
        tryCFs,
        cfs,
        g.sy,
        yearRange.from,
        g.ccy,
        defaultCurrency,
        fxRates
      );
    else
      populateData(
        optCFs,
        cfs,
        g.sy,
        yearRange.from,
        g.ccy,
        defaultCurrency,
        fxRates
      );
    mergeCFs(mCFs, cfs, g.sy, g.ccy, defaultCurrency, fxRates);
  });
  let result = findEarliestFFYear(ffGoal, mCFs, ffYear, mustCFs, tryCFs);
  return {
    mustCFs,
    tryCFs,
    optCFs,
    mergedCFs: mCFs,
    oppCostCache: {},
    ffResult: result,
    ffYear: isFFPossible(result, ffGoal.sa as number) ? result.ffYear : null,
    rr: result?.rr,
    aa: result?.aa,
  };
};

export const calculateFIImpactYears = (
  ffGoal: CreateGoalInput,
  allGoals: Array<CreateGoalInput>,
  allCFs: any,
  ffYear: number | null,
  defaultCurrency: string,
  fxRates: any,
  startYear: number,
  cfs: Array<number>,
  goalId: string,
  goalImp: LMH,
  goalCurrency: string,
  existingMergedCFs: any,
  existingMustCFs: any,
  existingTryCFs: any
) => {
  if (!ffGoal) return null;
  let mCFs: any = Object.assign({}, existingMergedCFs);
  let highImpCFs: any = Object.assign([], existingMustCFs);
  let medImpCFs: any = Object.assign([], existingTryCFs);
  let nowYear = new Date().getFullYear();
  let currencyFactor = getCurrencyFactor(
    fxRates,
    goalCurrency,
    defaultCurrency
  );
  if (goalId) {
    let existingGoal = (
      allGoals?.filter((g) => g.id === goalId) as Array<CreateGoalInput>
    )[0];
    let existingSY = existingGoal.sy;
    let existingImp = existingGoal.imp;
    let existingCFs = allCFs[goalId];
    existingCFs.forEach((cf: number, i: number) => {
      let cashFlow = -cf * currencyFactor;
      appendValue(mCFs, existingSY + i, cashFlow);
      let index = existingSY + i - (nowYear + 1);
      if (existingImp === LMH.H) {
        appendValue(highImpCFs, index, cashFlow);
      } else if (existingImp === LMH.M) {
        appendValue(medImpCFs, index, cashFlow);
      }
    });
  }
  let nomineeAmt = ffGoal?.sa as number;
  let resultWithoutGoal = findEarliestFFYear(
    ffGoal,
    mCFs,
    ffYear,
    highImpCFs,
    medImpCFs
  );
  if (!isFFPossible(resultWithoutGoal, nomineeAmt))
    return {
      impactYears: null,
      rr: resultWithoutGoal.rr,
    };
  cfs.forEach((cf, i) => {
    let cashFlow = cf * currencyFactor;
    appendValue(mCFs, startYear + i, cashFlow);
    let index = startYear + i - (nowYear + 1);
    if (goalImp === LMH.H) {
      appendValue(highImpCFs, index, cashFlow);
    } else if (goalImp === LMH.M) {
      appendValue(medImpCFs, index, cashFlow);
    }
  });
  let resultWithGoal = findEarliestFFYear(
    ffGoal,
    mCFs,
    ffYear,
    highImpCFs,
    medImpCFs
  );
  if (!isFFPossible(resultWithGoal, nomineeAmt))
    return {
      impactYears: null,
      rr: resultWithoutGoal.rr,
    };
  return {
    impactYears: resultWithoutGoal.ffYear - resultWithGoal.ffYear,
    rr: resultWithoutGoal.rr,
  };
};
