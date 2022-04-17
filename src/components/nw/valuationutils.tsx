import {
  addYears,
  differenceInCalendarYears,
  differenceInMonths,
} from "date-fns";
import simpleStorage from "simplestorage.js";
import {
  AssetSubType,
  AssetType,
  CreateUserHoldingsInput,
  CreateUserInsInput,
  HoldingInput,
  InstrumentInput,
  InsType,
  InsWatchInput,
  MFSchemeType,
  PropertyInput,
  PropertyType,
  RiskProfile,
} from "../../api/goals";
import {
  LOCAL_DATA_TTL,
  LOCAL_INS_DATA_KEY,
  LOCAL_NPS_DATA_KEY,
} from "../../CONSTANTS";
import { getCompoundedIncome, getNPV } from "../calc/finance";
import {
  awsdate,
  getCryptoPrevPrice,
  getNumberOfDays,
  includesAny,
} from "../utils";
import { ALL_FAMILY } from "./FamilyInput";
import {
  doesHoldingMatch,
  doesMemberMatch,
  doesPropertyMatch,
  getCommodityRate,
  getCryptoRate,
  initializeNPSData,
  isFund,
  isLargeCap,
  loadMatchingINBond,
  loadMatchingINExchange,
  loadMatchingINMutual,
} from "./nwutils";
const today = new Date();
const presentMonth = today.getMonth() + 1;
const presentYear = today.getFullYear();

const loadInstrumentPrices = async (
  fun: Function,
  ids: Array<string>,
  allInsData: any
) => {
  if (!ids.length) return null;
  let matchingList: Array<any> | null = await fun(ids);
  if (!matchingList || !matchingList.length) return ids;
  matchingList?.forEach(
    (matchingEntry: InstrumentInput) =>
      (allInsData[matchingEntry.id] = matchingEntry)
  );
  if (matchingList.length === ids.length) return null;
  let unmatched: Array<string> = [];
  for (let id of ids) {
    if (!allInsData[id]) unmatched.push(id);
  }
  return unmatched;
};

export const loadInstruments = async (ids: Array<string>) => {
  let mfIds: Array<string> = [];
  let bondIds: Array<string> = [];
  let exchangeIds: Array<string> = [];
  let gotodb = false;
  let allInsData: any = simpleStorage.get(LOCAL_INS_DATA_KEY);
  if (!allInsData) allInsData = {};
  ids.forEach((id: string) => {
    isFund(id) ? mfIds.push(id) : exchangeIds.push(id);
    if (!allInsData[id]) gotodb = true;
  });
  if (!gotodb) return allInsData;
  let unmatchedIds: Array<string> | null = [];
  if (mfIds.length)
    unmatchedIds = await loadInstrumentPrices(
      loadMatchingINMutual,
      mfIds,
      allInsData
    );
  if (unmatchedIds?.length) exchangeIds.push(...unmatchedIds);
  if (exchangeIds.length)
    unmatchedIds = await loadInstrumentPrices(
      loadMatchingINExchange,
      exchangeIds,
      allInsData
    );
  if (unmatchedIds?.length) bondIds.push(...unmatchedIds);
  if (bondIds.length)
    await loadInstrumentPrices(loadMatchingINBond, bondIds, allInsData);
  simpleStorage.set(LOCAL_INS_DATA_KEY, allInsData, LOCAL_DATA_TTL);
  return allInsData;
};

const initializeInsData = async (instruments: Array<InstrumentInput>) => {
  const ids: Array<string> = [];
  instruments.forEach((instrument: InstrumentInput) => ids.push(instrument.id));
  return await loadInstruments(ids);
};

const getCashFlows = (
  amt: number,
  bygoneDuration: number,
  remainingDuration: number,
  rate: number,
  isMonth: boolean,
  subt: string
) => {
  let cashflows: any = [];
  let count = 0;
  let monthLeftForCurrentYear = 12 - presentMonth;
  let bygoneTimeToCalculateForCI = isMonth
    ? (monthLeftForCurrentYear + bygoneDuration) / 12
    : bygoneDuration;
  if (bygoneDuration >= 0) {
    amt =
      subt === "L"
        ? amt
        : getCompoundedIncome(
            rate,
            amt,
            bygoneTimeToCalculateForCI,
            isMonth ? 12 : 1
          );
    if (isMonth && monthLeftForCurrentYear > 0) {
      cashflows = Array(Math.round(1)).fill(amt * 12);
      // cashflows = Array(Math.round(monthLeftForCurrentYear)).fill(amt);
    }
  }
  if (isMonth) {
    for (
      let index = 0;
      index < remainingDuration - monthLeftForCurrentYear;
      index++
    ) {
      count++;
      if (count === 12) {
        amt =
          subt === "L" ? amt : getCompoundedIncome(rate as number, amt, 1, 12);
        cashflows = [...cashflows, ...Array(Math.round(1)).fill(amt * 12)];
        // cashflows = [...cashflows, ...Array(Math.round(12)).fill(amt)];
        count = 0;
      }
    }
    if (count < 12 && count > 0) {
      amt =
        subt === "L"
          ? amt
          : getCompoundedIncome(rate as number, amt, count / 12, 12);
      cashflows = [...cashflows, ...Array(Math.round(1)).fill(amt * count)];
      // cashflows = [...cashflows, ...Array(Math.round(count)).fill(amt)];
    }
  } else {
    for (let index = 0; index <= remainingDuration; index++) {
      amt = subt === "L" ? amt : getCompoundedIncome(rate as number, amt, 1, 1);
      cashflows = cashflows.concat(Array(Math.round(1)).fill(amt));
    }
  }
  return cashflows;
};

export const calculateDifferenceInYears = (
  em: number,
  ey: number,
  sm: number,
  sy: number
) => {
  return differenceInCalendarYears(
    new Date(ey, em - 1, 30),
    new Date(sy, sm - 1, 1)
  );
};

export const calculateDifferenceInMonths = (
  em: number,
  ey: number,
  sm: number,
  sy: number
) => {
  return differenceInMonths(new Date(ey, em - 1, 30), new Date(sy, sm - 1, 1));
};

export const calculateAddYears = (
  mon: number,
  yr: number,
  yearsToAdd: number
) => {
  const result = addYears(new Date(yr, mon - 1, 1), yearsToAdd);
  const year = result.getFullYear();
  const month = result.getMonth() + 1;
  return { year, month };
};

export const calculateInsurance = (
  holding: HoldingInput,
  le: number,
  dob: string
) => {
  let { sm, sy, em, ey, amt, chg, subt } = holding;
  let [durationFromStartToEnd, remainingDuration] = [0, 0];
  let cashflows: Array<number> = [];
  let isMonth: boolean = holding.chgF === 1 ? false : true;
  const calc = isMonth
    ? calculateDifferenceInMonths
    : calculateDifferenceInYears;

  if ((subt === "H" || subt === "A") && dob && le) {
    const birthdate: Date = new Date(dob);
    const { year, month } = calculateAddYears(
      birthdate.getMonth() + 1,
      birthdate.getFullYear(),
      le
    ); //lifeExpectancy year and month
    durationFromStartToEnd = calc(month, year, sm as number, sy as number);
    remainingDuration = calc(month, year, presentMonth, presentYear);
  } else {
    durationFromStartToEnd = calc(
      em as number,
      ey as number,
      sm as number,
      sy as number
    );
    remainingDuration = calc(
      em as number,
      ey as number,
      presentMonth,
      presentYear
    );
  }

  if (remainingDuration < 0 || isNaN(remainingDuration))
    return { cashflows, subt };
  if (remainingDuration === 0) return { cashflows, subt };
  let bygoneDuration = durationFromStartToEnd - remainingDuration;
  // if (subt && subt !== "L") {
  cashflows = getCashFlows(
    amt as number,
    bygoneDuration,
    remainingDuration,
    chg as number,
    isMonth,
    subt as string
  );
  // } else {
  // cashflows = Array(Math.round(remainingDuration)).fill(amt);
  // }
  return { cashflows, subt };
  // const npv = getNPV(discountRate, cashflows, 0, isMonth ? true : false, true);
  // return npv;
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
  if (remainingDuration >= 1) isShortTerm = false;
  if (!holding.chgF)
    return {
      valuation: holding.amt as number,
      maturityAmt: holding.amt as number,
    };
  const duration = calculateDifferenceInYears(
    presentMonth,
    presentYear,
    holding.sm as number,
    holding.sy as number
  );
  const durationFromStartToEnd = calculateDifferenceInYears(
    holding.em as number,
    holding.ey as number,
    holding.sm as number,
    holding.sy as number
  );
  valuation = getCompoundedIncome(
    holding.chg as number,
    holding.amt as number,
    duration,
    holding.chgF
  );
  maturityAmt = getCompoundedIncome(
    holding.chg as number,
    holding.amt as number,
    durationFromStartToEnd,
    holding.chgF
  );
  return { valuation, maturityAmt, isShortTerm };
};

export const calculateProperty = (
  property: PropertyInput,
  selectedMembers: Array<string>
) => {
  let valuationByMembers: Array<{ fid: string; value: number }> = [];
  let total = 0;
  const duration = calculateDifferenceInYears(
    presentMonth,
    presentYear,
    property.mvm as number,
    property.mvy as number
  );
  if (duration < 0) {
    total = property.mv as number;
    return { total, valuationByMembers };
  }
  total = getCompoundedIncome(property.rate, property.mv as number, duration);
  if (!selectedMembers.includes(ALL_FAMILY)) {
    for (let owner of property.own) {
      if (selectedMembers.includes(owner.fId)) {
        valuationByMembers.push({
          fid: owner.fId,
          value: (total * owner.per) / 100,
        });
      }
    }
  }
  return { total, valuationByMembers };
};

export const calculateVehicle = (holding: HoldingInput) => {
  const duration = calculateDifferenceInYears(
    presentMonth,
    presentYear,
    holding.sm as number,
    holding.sy as number
  );
  if (duration < 0) return 0;
  return getCompoundedIncome(
    -(holding.chg as number),
    holding.amt as number,
    duration
  );
};

export const calculateCrypto = (
  holding: HoldingInput,
  selectedCurrency: string,
  fxRates: any
) => {
  return getCryptoRate(holding.name as string, selectedCurrency, fxRates)
    .then((rate) => holding.qty * rate)
    .catch(() => 0);
};

export const calculatePM = (
  holding: HoldingInput,
  selectedCurrency: string,
  fxRates: any
) => {
  return getCommodityRate(
    holding.subt as string,
    holding.name as string,
    selectedCurrency,
    fxRates
  )
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

export const calculateNPS = async (holding: HoldingInput) => {
  let fixed = 0;
  let equity = 0;
  let value = 0;
  const npsData = await initializeNPSData();
  if (npsData) {
    const data = npsData.find((item) => item.id === holding.name);
    if (data) {
      value = holding.qty * data.price;
      if (data.type === AssetType.E) equity += value;
      else if (data.type === AssetType.F) fixed += value;
      else if (data.type === AssetType.H) {
        fixed += 0.8 * value;
        equity += 0.2 * value;
      }
    }
  }
  return { value, fixed, equity };
};

const initRiskAttribs = () => {
  return {
    stocks: 0,
    bonds: 0,
    mfs: 0,
    etfs: 0,
    reit: 0,
    others: 0,
  };
};

export const priceInstruments = async (
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
  let riskTotals: any = {
    [RiskProfile.VC]: initRiskAttribs(),
    [RiskProfile.C]: initRiskAttribs(),
    [RiskProfile.M]: initRiskAttribs(),
    [RiskProfile.A]: initRiskAttribs(),
    [RiskProfile.VA]: initRiskAttribs(),
  };
  let cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  if (!cachedData) {
    cachedData = await initializeInsData(instruments);
  }
  instruments.forEach((instrument: InstrumentInput) => {
    const id = instrument.id;
    const data = cachedData[id];
    if (
      data &&
      doesHoldingMatch(instrument, selectedMembers, selectedCurrency)
    ) {
      let value = instrument.qty * data.price;
      total += value;
      if (data.itype === InsType.ETF) {
        totalETFs += value;
        if (data.risk) riskTotals[data.risk].etfs += value;
      } else if (isFund(instrument.id)) {
        totalMFs += value;
        if (data.risk) riskTotals[data.risk].mfs += value;
      }
      if (data.subt === AssetSubType.GoldB) totalFGold += value;
      else if (data.itype && data.itype === InsType.REIT) {
        totalFRE += value;
        if (data.risk) riskTotals[data.risk].reit += value;
      } else if (data.itype && data.itype === InsType.InvIT) {
        totalInv += value;
        if (data.risk) riskTotals[data.risk].others += value;
      } else if (data.type === AssetType.E) {
        totalFEquity += value;
        if (isLargeCap(data)) {
          if (data.itype === InsType.ETF) largeCapETFs += value;
          else
            isFund(instrument.id)
              ? (largeCapFunds += value)
              : (largeCapStocks += value);
        } else multiCap += value;
        if (!isFund(id) && !data.itype) {
          totalStocks += value;
          if (data.risk) riskTotals[data.risk].stocks += value;
        }
      } else if (data.type === AssetType.F) {
        totalFFixed += value;
        if (data.subt === AssetSubType.I) indexFunds += value;
        else if (data.subt === AssetSubType.L) liquidFunds += value;
        else if (data.mftype && data.subt === AssetSubType.HB) {
          if (data.mftype === MFSchemeType.I) intervalFunds += value;
          if (data.mftype === MFSchemeType.C) fmp += value;
        } else {
          totalBonds += value;
          if (data.risk) riskTotals[data.risk].bonds += value;
        }
      } else if (data.type === AssetType.H) {
        if (includesAny(data.name as string, ["conservative"])) {
          totalFFixed += 0.7 * value;
          totalFEquity += 0.3 * value;
          totalBonds += 0.7 * value;
          multiCap += 0.3 * value;
        } else if (includesAny(data.name as string, ["multi-asset"])) {
          totalFGold += 0.1 * value;
          totalFEquity += 0.6 * value;
          totalFFixed += 0.3 * value;
          multiCap += 0.6 * value;
          totalBonds += 0.3 * value;
        } else if (includesAny(data.name as string, ["balanced"])) {
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
    liquidFunds,
    riskTotals,
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

export const priceLoans = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let total = 0;
  holdings.forEach((holding: HoldingInput) => {
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
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
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
      const { valuation, isShortTerm } = calculateCompundingIncome(holding);
      total += valuation;
      if (isShortTerm) totalShortTerm += valuation;
    }
  });
  return { total, totalShortTerm };
};

export const priceLtdep = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let total = 0;
  holdings.forEach((holding: HoldingInput) => {
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
      total += calculateCompundingIncome(holding).valuation;
    }
  });
  return total;
};

export const priceP2P = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let total = 0;
  holdings.forEach((holding: HoldingInput) => {
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
      total += calculateCompundingIncome(holding).valuation;
    }
  });
  return total;
};

const calculateBalance = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
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

export const priceAngel = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
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
    const result = calculateProperty(property, selectedMembers);
    let value = 0;
    if (selectedMembers.includes(ALL_FAMILY)) value = result.total;
    result.valuationByMembers.map((item: { fid: string; value: number }) => {
      value += item.value;
    });
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
  return {
    total,
    totalOtherProperty,
    totalCommercial,
    totalResidential,
    totalPlot,
  };
};

export const priceVehicles = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let total = 0;
  holdings.forEach((holding: HoldingInput) => {
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
      total += calculateVehicle(holding);
    }
  });
  return total;
};

export const priceInsurance = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string,
  userInfo: any
) => {
  let yearlyCashflow: any = {};
  let presentYearValue: { [key: string]: number } = {};
  holdings.forEach((holding: HoldingInput) => {
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
      let year = new Date().getFullYear();
      const { cashflows } = calculateInsurance(
        holding,
        userInfo?.le,
        userInfo?.dob
      );
      presentYearValue[holding.subt as string] = cashflows[0];
      for (let value of cashflows) {
        if (yearlyCashflow[year]) {
          const val = yearlyCashflow[year];
          yearlyCashflow[year] = val + value;
        } else {
          yearlyCashflow[year] = value;
        }
        year++;
      }
    }
  });
  return { yearlyCashflow, presentYearValue };
};

export const priceCrypto = async (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string,
  fxRates: any
) => {
  let total = 0;
  for (let holding of holdings) {
    if (doesMemberMatch(holding, selectedMembers)) {
      total += await calculateCrypto(holding, selectedCurrency, fxRates);
    }
  }
  return total;
};

export const pricePF = (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let total = 0;
  let totalPPF = 0;
  let totalVPF = 0;
  let totalEPF = 0;
  holdings.forEach((record: HoldingInput) => {
    if (doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
      const value = calculateProvidentFund(record);
      total += value;
      if (record.subt === "PF") totalPPF += value;
      if (record.subt === "VF") totalVPF += value;
      if (record.subt === "EF") totalEPF += value;
    }
  });
  return { total, totalPPF, totalVPF, totalEPF };
};

export const priceNPS = async (
  holdings: Array<HoldingInput>,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let total = 0;
  let totalNPSGFixed = 0;
  let totalNPSCFixed = 0;
  let totalNPSEquity = 0;
  for (const holding of holdings) {
    if (
      holding &&
      doesHoldingMatch(holding, selectedMembers, selectedCurrency)
    ) {
      const { value, fixed, equity } = await calculateNPS(holding);
      total += value;
      holding.subt === AssetSubType.CB
        ? (totalNPSCFixed += fixed)
        : (totalNPSGFixed += fixed);
      totalNPSEquity += equity;
    }
  }
  return { total, totalNPSGFixed, totalNPSCFixed, totalNPSEquity };
};

export const calculateTotalAssets = async (
  holdings: CreateUserHoldingsInput | null,
  insHoldings: CreateUserInsInput | null,
  selectedMembers: Array<string>,
  selectedCurrency: string,
  fxRates: any
) => {
  let totalSavings = 0;
  let totalLendings = 0;
  let totalFGold = 0;
  let totalPGold = 0;
  let totalFRE = 0;
  let totalFInv = 0;
  let totalProperties = 0;
  let totalAngel = 0;
  let totalOthers = 0;
  let totalVehicles = 0;
  let totalPF = 0;
  let totalOtherProperty = 0;
  let totalCommercial = 0;
  let totalResidential = 0;
  let totalPlot = 0;
  let totalEPF = 0;
  let totalVPF = 0;
  let totalPPF = 0;
  let totalNPSEquity = 0;
  let totalNPSGFixed = 0;
  let totalNPSCFixed = 0;
  let totalCrypto = 0;
  let totalP2P = 0;
  let totalLtdep = 0;
  let totalPM = 0;
  let totalLargeCapStocks = 0;
  let totalLargeCapFunds = 0;
  let totalMultiCap = 0;
  let totalLargeCapETF = 0;
  let totalIndexFunds = 0;
  let totalLiquidFunds = 0;
  let totalIntervalFunds = 0;
  let totalFMP = 0;
  let totalFFixed = 0;
  let totalStLendings = 0;
  let totalBonds = 0;
  let totalStocks = 0;
  let totalNPS = 0;
  let totalInstruments = 0;

  if (insHoldings?.ins) {
    const value = await priceInstruments(
      insHoldings.ins,
      selectedMembers,
      selectedCurrency
    );
    totalInstruments += value.total;
    totalFGold += value.totalFGold;
    totalFFixed += value.totalFFixed;
    totalFRE += value.totalFRE;
    totalFInv += value.totalInv;
    totalBonds += value.totalBonds;
    totalStocks += value.totalStocks;
    totalLargeCapStocks += value.largeCapStocks;
    totalLargeCapFunds += value.largeCapFunds;
    totalLargeCapETF += value.largeCapETFs;
    totalMultiCap += value.multiCap;
    totalIndexFunds += value.indexFunds;
    totalFMP += value.fmp;
    totalIntervalFunds = value.intervalFunds;
    totalLiquidFunds += value.liquidFunds;
  }
  if (holdings?.pm) {
    const value = await pricePM(
      holdings.pm,
      selectedMembers,
      selectedCurrency,
      fxRates
    );
    totalPM += value.total;
    totalPGold += value.totalPGold;
  }
  if (holdings?.crypto) {
    const total = await priceCrypto(
      holdings.crypto,
      selectedMembers,
      selectedCurrency,
      fxRates
    );
    totalCrypto += total;
  }
  if (holdings?.pf) {
    const value = pricePF(holdings.pf, selectedMembers, selectedCurrency);
    totalPF += value.total;
    totalEPF += value.totalEPF;
    totalVPF += value.totalVPF;
    totalPPF += value.totalPPF;
  }
  if (holdings?.nps) {
    const value = await priceNPS(
      holdings.nps,
      selectedMembers,
      selectedCurrency
    );
    totalNPS += value.total;
    totalNPSEquity += value.totalNPSEquity;
    totalNPSGFixed += value.totalNPSGFixed;
    totalNPSCFixed += value.totalNPSCFixed;
  }
  if (holdings?.vehicles) {
    const total = priceVehicles(
      holdings.vehicles,
      selectedMembers,
      selectedCurrency
    );
    totalVehicles += total;
  }
  if (holdings?.property) {
    const value = priceProperties(
      holdings.property,
      selectedMembers,
      selectedCurrency
    );
    totalProperties += value.total;
    totalOtherProperty += value.totalOtherProperty;
    totalCommercial += value.totalCommercial;
    totalResidential += value.totalResidential;
    totalPlot += value.totalPlot;
  }
  if (holdings?.savings) {
    const total = priceSavings(
      holdings.savings,
      selectedMembers,
      selectedCurrency
    );
    totalSavings += total;
  }
  if (holdings?.dep) {
    const { total, totalShortTerm } = priceLendings(
      holdings.dep,
      selectedMembers,
      selectedCurrency
    );
    totalLendings += total;
    totalStLendings += totalShortTerm;
  }
  if (holdings?.ltdep) {
    const total = priceLtdep(holdings.ltdep, selectedMembers, selectedCurrency);
    totalLtdep += total;
  }
  if (holdings?.other) {
    const total = priceOthers(
      holdings.other,
      selectedMembers,
      selectedCurrency
    );
    totalOthers += total;
  }
  if (holdings?.angel) {
    const total = priceAngel(holdings.angel, selectedMembers, selectedCurrency);
    totalAngel += total;
  }
  if (holdings?.p2p) {
    const total = priceP2P(holdings.p2p, selectedMembers, selectedCurrency);
    totalP2P += total;
  }

  const totalCash =
    totalSavings + totalLendings + totalLtdep + totalPF + totalLiquidFunds;
  const totalPhysical = totalProperties + totalVehicles + totalPM + totalOthers;
  const totalFinancial =
    totalInstruments +
    totalAngel +
    totalCrypto +
    totalP2P +
    totalNPS -
    totalLiquidFunds;
  const totalAssets = totalCash + totalPhysical + totalFinancial;
  return {
    totalCash,
    totalSavings,
    totalLendings,
    totalFGold,
    totalPGold,
    totalFRE,
    totalFInv,
    totalProperties,
    totalAssets,
    totalAngel,
    totalOthers,
    totalVehicles,
    totalPF,
    totalOtherProperty,
    totalCommercial,
    totalResidential,
    totalPlot,
    totalEPF,
    totalVPF,
    totalPPF,
    totalNPSEquity,
    totalNPSGFixed,
    totalNPSCFixed,
    totalCrypto,
    totalP2P,
    totalLtdep,
    totalPM,
    totalLargeCapStocks,
    totalLargeCapFunds,
    totalMultiCap,
    totalLargeCapETF,
    totalIndexFunds,
    totalLiquidFunds,
    totalIntervalFunds,
    totalFMP,
    totalFFixed,
    totalStLendings,
    totalBonds,
    totalStocks,
  };
};

export const calculateTotalLiabilities = (
  holdings: CreateUserHoldingsInput,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  let totalLiabilities = 0;
  if (holdings?.loans) {
    const total = priceLoans(holdings.loans, selectedMembers, selectedCurrency);
    totalLiabilities += total;
  }
  if (holdings?.credit) {
    const total = priceCredit(
      holdings.credit,
      selectedMembers,
      selectedCurrency
    );
    totalLiabilities += total;
  }
  return totalLiabilities;
};

const calculateDiffPercent = (curr: number, prev: number) => {
  const diff = (100 * (curr - prev)) / prev;
  return Math.round(diff * 100) / 100;
};

export const sortDescending = (array: any[], key: string) =>
  array.sort((a, b) => parseFloat(b[key]) - parseFloat(a[key]));

export const sortAscending = (array: any[], key: string) =>
  array.sort((a, b) => parseFloat(a[key]) - parseFloat(b[key]));

const checkDate = (date: any) => {
  const todayDate = awsdate(today);
  const days = getNumberOfDays(date, todayDate as string);
  return days <= 3;
};

export const calculatePrice = async (
  insHoldings: Array<InstrumentInput>,
  crypto?: Array<HoldingInput>,
  nps?: Array<HoldingInput>,
  fxRates?: any,
  currency?: string
) => {
  let [yhighList, ylowList, volGainers, volLosers, gainers, losers]: any = [
    [],
    [],
    [],
    [],
    [],
    [],
  ];
  const isin: { [key: string]: string } = {};
  let cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  insHoldings.forEach((instrument: InstrumentInput) => {
    const id = instrument.id;
    const data = cachedData[id];
    if (isin[id] || !data) return;
    isin[id] = id;
    const { prev, price, name, yhigh, ylow, yhighd, ylowd, vol, prevol } = data;
    if (yhigh && checkDate(yhighd))
      yhighList.push({ name, result: yhigh, id, value: price });
    if (ylow && checkDate(ylowd))
      ylowList.push({ name, result: ylow, id, value: price });
    const diff = calculateDiffPercent(price, prev);
    const volDiff = vol && prevol && calculateDiffPercent(vol, prevol);
    Math.sign(diff) > 0
      ? gainers.push({ name, result: diff, id, value: price })
      : losers.push({ name, result: diff, id, value: price });
    if (volDiff) {
      Math.sign(volDiff) > 0
        ? volGainers.push({ name, result: volDiff, id, value: vol })
        : volLosers.push({ name, result: volDiff, id, value: vol });
    }
  });
  if (nps?.length) {
    let cachedData = simpleStorage.get(LOCAL_NPS_DATA_KEY);
    nps.forEach((holding: HoldingInput) => {
      const id = holding.name as string;
      if (isin[id]) return;
      isin[id] = id;
      const { prev, price, name } = cachedData.find(
        (item: { id: any }) => item.id === id
      );
      const diff = calculateDiffPercent(price, prev);
      Math.sign(diff) > 0
        ? gainers.push({ name, result: diff, id, value: price })
        : losers.push({ name, result: diff, id, value: price });
    });
  }
  if (crypto?.length) {
    for (let hold of crypto) {
      const id = hold.name as string;
      if (isin[id]) continue;
      isin[id] = id;
      const price = await getCryptoRate(id, currency as string, fxRates);
      const prev = await getCryptoPrevPrice(id, currency as string, fxRates);
      if (!prev || !price) continue;
      const diff = calculateDiffPercent(price, prev);
      Math.sign(diff) > 0
        ? gainers.push({ name: id, result: diff, id, value: price })
        : losers.push({ name: id, result: diff, id, value: price });
    }
  }
  gainers = sortDescending(gainers, "result").slice(0, 3);
  losers = sortAscending(losers, "result").slice(0, 3);
  volGainers = sortDescending(volGainers, "result").slice(0, 3);
  volLosers = sortAscending(volLosers, "result").slice(0, 3);
  return { gainers, losers, yhighList, ylowList, volGainers, volLosers };
};

export const calculateAlerts = async (
  holdings: CreateUserHoldingsInput | null,
  insHoldings: CreateUserInsInput | null,
  fxRates: any,
  currency: string
) => {
  if (insHoldings?.ins?.length) {
    if (!simpleStorage.get(LOCAL_INS_DATA_KEY))
      await initializeInsData(insHoldings?.ins);
  }
  if (holdings?.nps?.length) {
    if (!simpleStorage.get(LOCAL_NPS_DATA_KEY)) await initializeNPSData();
  }
  return await calculatePrice(
    insHoldings?.ins as InstrumentInput[],
    holdings?.crypto as HoldingInput[],
    holdings?.nps as HoldingInput[],
    fxRates,
    currency
  );
};

export const initializeWatchlist = async (instruments: Array<InsWatchInput>) => {
  const ids: Array<string> = [];
  instruments.forEach((instrument: InsWatchInput) => ids.push(instrument.id));
  return await loadInstruments(ids);
};