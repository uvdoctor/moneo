import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import {
  CreateGoalInput,
  LMH,
  LoanType,
  RiskProfile,
  TargetInput,
  TaxLiability,
} from "../../api/goals";
import { CalcContext } from "../calc/CalcContext";
import CalcTemplate from "../calc/CalcTemplate";
import FIYearResult from "../calc/FIYearResult";
import FISavingsResult from "../calc/FISavingsResult";
import { findEarliestFFYear, isFFPossible } from "./cfutils";
import { PlanContext } from "./PlanContext";
import { AppContext } from "../AppContext";

const FIGoalContext = createContext({});
interface FIGoalContextProviderProps {
  children?: ReactNode;
}

function FIGoalContextProvider({ children }: FIGoalContextProviderProps) {
  const { userInfo }: any = useContext(AppContext);
  const { mustCFs, tryCFs, mergedCFs, dr, ffYear }: any =
    useContext(PlanContext);
  const {
    goal,
    currency,
    setCFs,
    startYear,
    endYear,
    resultTabs,
    setResultTabs,
    resultTabIndex,
    setResultTabIndex,
    setResults,
    allInputDone,
    setError,
    cfs,
    setWipGoal,
  }: any = useContext(CalcContext);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(
    userInfo ? userInfo.rp : RiskProfile.M
  );
  const [expenseAfterFF, setExpenseAfterFF] = useState<number>(
    goal?.tdli as number
  );
  const [expenseChgRate, setExpenseChgRate] = useState<number>(
    goal?.btr as number
  );
  const [nw, setNW] = useState<number>(goal?.ra as number);
  const [avgMonthlySavings, setAvgMonthlySavings] = useState<number>(
    goal?.rachg as number
  );
  const [emergencyFund, setEmergencyFund] = useState<number>(
    goal.loan.emi as number
  );
  const [emergencyFundBY, setEmergencyFundBY] = useState<number>(
    goal.loan.ry as number
  );
  const [emergencyFundChgRate, setEmergencyFundChgRate] = useState<number>(
    goal.loan.per as number
  );
  const [monthlySavingsRate, setMonthlySavingsRate] = useState<number>(
    goal?.tbr as number
  );
  const [monthlyMaxSavings, setMonthlyMaxSavings] = useState<number>(
    goal.loan?.pmi as number
  );
  const [taxRate, setTaxRate] = useState<number>(goal.tdr);
  const [leaveBehind, setLeaveBehind] = useState<number>(goal?.sa as number);
  const [carePremium, setCarePremium] = useState<number>(goal?.cp as number);
  const [carePremiumChgPer, setCarePremiumChgPer] = useState<number>(
    goal?.amper as number
  );
  const [carePremiumSY, setCarePremiumSY] = useState<number>(
    goal?.amsy as number
  );
  const [carePremiumDur, setCarePremiumDur] = useState<number>(
    goal?.achg as number
  );
  const [careTaxDedLimit, setCareTaxDedLimit] = useState<number>(goal.tdl);
  const [cpBY, setCPBY] = useState<number>(goal?.chg as number);
  const [retirementIncomePer, setRetirementIncomePer] = useState<number>(
    goal?.aiper as number
  );
  const [retirementIncomeSY, setRetirementIncomeSY] = useState<number>(
    goal?.aisy as number
  );
  const [retirementIncome, setRetirementIncome] = useState<number>(
    goal?.tbi as number
  );
  const [successionTaxRate, setSuccessionTaxRate] = useState<number>(
    goal?.dr as number
  );
  const [gains, setGains] = useState<Array<TargetInput>>(goal.pg);
  const [losses, setLosses] = useState<Array<TargetInput>>(goal.pl);
  const [retirementAge, setRetirementAge] = useState<number>(goal.loan?.rate);
  const [planDuration, setPlanDuration] = useState<number>(goal.loan?.dur);
  const [cashPerf, setCashPerf] = useState<number>(goal?.pp?.cash);
  const [medTermBondsPerf, setMedTermBondsPerf] = useState<number>(
    goal?.pp?.mtb
  );
  const [taxExemptBondsPerf, setTaxExemptBondsPerf] = useState<number>(
    goal?.pp?.teb
  );
  const [iMedTermBondsPerf, setIMedTermBondsPerf] = useState<number>(
    goal?.pp?.imtb
  );
  const [highYieldBondsPerf, setHighYieldBondsPerf] = useState<number>(
    goal?.pp?.hyb
  );
  const [iHighYieldBondsPerf, setIHighYieldBondsPerf] = useState<number>(
    goal?.pp?.ihyb
  );
  const [reitPerf, setREITPerf] = useState<number>(goal?.pp?.reit);
  const [iREITPerf, setIREITPerf] = useState<number>(goal?.pp?.ireit);
  const [reitETFPerf, setREITETFPerf] = useState<number>(goal?.pp?.reitETF);
  const [iREITETFPerf, setIREITETFPerf] = useState<number>(goal?.pp?.ireitETF);
  const [realEstatePerf, setRealEstatePerf] = useState<number>(goal?.pp?.re);
  const [goldPerf, setGoldPerf] = useState<number>(goal?.pp?.gold);
  const [goldBondsPerf, setGoldBondsPerf] = useState<number>(goal?.pp?.goldb);
  const [largeCapStocksPerf, setLargeCapStocksPerf] = useState<number>(
    goal?.pp?.lcs
  );
  const [largeCapETFPerf, setLargeCapETFPerf] = useState<number>(
    goal?.pp?.lcetf
  );
  const [midCapStocksPerf, setMidCapStocksPerf] = useState<number>(
    goal?.pp?.mcs
  );
  const [smallCapStocksPerf, setSmallCapStocksPerf] = useState<number>(
    goal?.pp?.scs
  );
  const [divGrowthStocksPerf, setDivGrowthStocksPerf] = useState<number>(
    goal?.pp?.dgs
  );
  const [iLargeCapStocksPerf, setILargeCapStocksPerf] = useState<number>(
    goal?.pp?.ilcs
  );
  const [iLargeCapETFPerf, setILargeCapETFPerf] = useState<number>(
    goal?.pp?.ilcetf
  );
  const [iMidCapStocksPerf, setIMidCapStocksPerf] = useState<number>(
    goal?.pp?.imcs
  );
  const [iSmallCapStocksPerf, setISmallCapStocksPerf] = useState<number>(
    goal?.pp?.iscs
  );
  const [uniqueCollectionPerf, setUniqueCollectionPerf] = useState<number>(
    goal?.pp?.uc
  );
  const [cryptoPerf, setCryptoPerf] = useState<number>(goal?.pp?.crypto);
  const [p2pPerf, setP2PPerf] = useState<number>(goal?.pp?.p2p);
  const [taxLiability, setTaxLiability] = useState<TaxLiability>(
    userInfo ? userInfo.tax : TaxLiability.M
  );
  const [wipResult, setWipResult] = useState<any>({});

  const getLatestGoalState = () => {
    let g: CreateGoalInput = {
      name: goal.name,
      by: goal.by,
      sy: startYear,
      ey: endYear,
      ra: nw,
      rachg: avgMonthlySavings,
      tdr: taxRate,
      tdl: careTaxDedLimit,
      ccy: currency,
      type: goal.type,
      imp: LMH.H,
      amsy: carePremiumSY,
      amper: carePremiumChgPer,
      achg: carePremiumDur,
      cp: carePremium,
      chg: cpBY,
      aisy: retirementIncomeSY,
      aiper: retirementIncomePer,
      tbi: retirementIncome,
      sa: leaveBehind,
      dr: successionTaxRate,
      pg: gains && gains.length ? gains : [],
      pl: losses && losses.length ? losses : [],
      tdli: expenseAfterFF,
      btr: expenseChgRate,
      tbr: monthlySavingsRate,
      loan: {
        emi: emergencyFund,
        ry: emergencyFundBY,
        per: emergencyFundChgRate,
        dur: planDuration,
        rate: retirementAge,
        type: LoanType.A,
        pmi: monthlyMaxSavings,
      },
      rp: riskProfile,
      pp: {
        cash: cashPerf,
        mtb: medTermBondsPerf,
        imtb: iMedTermBondsPerf,
        hyb: highYieldBondsPerf,
        ihyb: iHighYieldBondsPerf,
        teb: taxExemptBondsPerf,
        reit: reitPerf,
        reitETF: reitETFPerf,
        ireit: iREITPerf,
        ireitETF: iREITETFPerf,
        re: realEstatePerf,
        gold: goldPerf,
        goldb: goldBondsPerf,
        lcs: largeCapStocksPerf,
        lcetf: largeCapETFPerf,
        ilcs: iLargeCapStocksPerf,
        ilcetf: iLargeCapETFPerf,
        mcs: midCapStocksPerf,
        scs: smallCapStocksPerf,
        imcs: iMidCapStocksPerf,
        iscs: iSmallCapStocksPerf,
        dgs: divGrowthStocksPerf,
        uc: uniqueCollectionPerf,
        crypto: cryptoPerf,
        p2p: p2pPerf,
      },
      manual:
        taxLiability === TaxLiability.NIL || taxLiability === TaxLiability.L
          ? 0
          : 1,
    };
    if (goal.id) g.id = goal.id;
    return g;
  };

  useEffect(() => {
    if (currency === "USD" || currency === "CAD" || currency === "GBP") {
      setCarePremium(0);
    }
  }, [currency]);

  useEffect(() => {
    setResults([
      ...[<FIYearResult key="fiyear" />, <FISavingsResult key="fiamt" />],
    ]);
  }, [cfs]);

  useEffect(() => {
    let invTargetChartTab = resultTabs[resultTabs.length - 1];
    if (!avgMonthlySavings && invTargetChartTab.active) {
      invTargetChartTab.active = false;
      setResultTabs([...resultTabs]);
      if (resultTabIndex === resultTabs.length - 1)
        setResultTabIndex(resultTabs.length - 2);
    } else if (avgMonthlySavings && !invTargetChartTab.active) {
      invTargetChartTab.active = true;
      setResultTabs([...resultTabs]);
    }
  }, [avgMonthlySavings]);

  useEffect(() => {
    if (!allInputDone) return;
    let g: CreateGoalInput = getLatestGoalState();
    setWipGoal(g);
    let result: any = findEarliestFFYear(g, mergedCFs, ffYear, mustCFs, tryCFs);
    if (!isFFPossible(result, leaveBehind)) {
      setError(
        `Please try again with different inputs / goals so that Financial Independence is Achievable by Age of ${retirementAge}.`
      );
    } else {
      setError("");
    }
    setWipResult(result);
    setCFs([...Object.values(result.ffCfs)]);
    console.log("FF Result is ", result);
  }, [
    startYear,
    endYear,
    currency,
    taxRate,
    careTaxDedLimit,
    carePremiumSY,
    carePremiumChgPer,
    carePremiumDur,
    carePremium,
    cpBY,
    retirementIncomeSY,
    retirementIncomePer,
    retirementIncome,
    leaveBehind,
    successionTaxRate,
    gains,
    losses,
    nw,
    avgMonthlySavings,
    monthlyMaxSavings,
    emergencyFund,
    emergencyFundBY,
    emergencyFundChgRate,
    expenseAfterFF,
    expenseChgRate,
    monthlySavingsRate,
    riskProfile,
    retirementAge,
    planDuration,
    dr,
    allInputDone,
    taxLiability,
    cashPerf,
    medTermBondsPerf,
    iMedTermBondsPerf,
    taxExemptBondsPerf,
    highYieldBondsPerf,
    iHighYieldBondsPerf,
    reitPerf,
    iREITPerf,
    reitETFPerf,
    iREITETFPerf,
    realEstatePerf,
    goldPerf,
    goldBondsPerf,
    largeCapStocksPerf,
    largeCapETFPerf,
    midCapStocksPerf,
    smallCapStocksPerf,
    divGrowthStocksPerf,
    iLargeCapStocksPerf,
    iLargeCapETFPerf,
    iMidCapStocksPerf,
    iSmallCapStocksPerf,
    uniqueCollectionPerf,
    cryptoPerf,
    p2pPerf,
  ]);

  return (
    <FIGoalContext.Provider
      value={{
        taxRate,
        setTaxRate,
        careTaxDedLimit,
        setCareTaxDedLimit,
        carePremiumSY,
        setCarePremiumSY,
        carePremiumChgPer,
        setCarePremiumChgPer,
        carePremiumDur,
        setCarePremiumDur,
        carePremium,
        setCarePremium,
        cpBY,
        setCPBY,
        retirementIncomeSY,
        setRetirementIncomeSY,
        retirementIncomePer,
        setRetirementIncomePer,
        retirementIncome,
        setRetirementIncome,
        leaveBehind,
        setLeaveBehind,
        successionTaxRate,
        setSuccessionTaxRate,
        gains,
        setGains,
        losses,
        setLosses,
        nw,
        setNW,
        avgMonthlySavings,
        setAvgMonthlySavings,
        monthlyMaxSavings,
        setMonthlyMaxSavings,
        expenseAfterFF,
        setExpenseAfterFF,
        expenseChgRate,
        setExpenseChgRate,
        monthlySavingsRate,
        setMonthlySavingsRate,
        riskProfile,
        setRiskProfile,
        emergencyFund,
        setEmergencyFund,
        emergencyFundChgRate,
        setEmergencyFundChgRate,
        emergencyFundBY,
        setEmergencyFundBY,
        retirementAge,
        setRetirementAge,
        planDuration,
        setPlanDuration,
        wipResult,
        cashPerf,
        setCashPerf,
        medTermBondsPerf,
        setMedTermBondsPerf,
        iMedTermBondsPerf,
        setIMedTermBondsPerf,
        taxExemptBondsPerf,
        setTaxExemptBondsPerf,
        highYieldBondsPerf,
        setHighYieldBondsPerf,
        iHighYieldBondsPerf,
        setIHighYieldBondsPerf,
        reitPerf,
        setREITPerf,
        iREITPerf,
        setIREITPerf,
        reitETFPerf,
        setREITETFPerf,
        iREITETFPerf,
        setIREITETFPerf,
        realEstatePerf,
        setRealEstatePerf,
        goldPerf,
        setGoldPerf,
        goldBondsPerf,
        setGoldBondsPerf,
        largeCapStocksPerf,
        setLargeCapStocksPerf,
        largeCapETFPerf,
        setLargeCapETFPerf,
        midCapStocksPerf,
        setMidCapStocksPerf,
        smallCapStocksPerf,
        setSmallCapStocksPerf,
        divGrowthStocksPerf,
        setDivGrowthStocksPerf,
        iLargeCapStocksPerf,
        setILargeCapStocksPerf,
        iLargeCapETFPerf,
        setILargeCapETFPerf,
        iMidCapStocksPerf,
        setIMidCapStocksPerf,
        iSmallCapStocksPerf,
        setISmallCapStocksPerf,
        uniqueCollectionPerf,
        setUniqueCollectionPerf,
        cryptoPerf,
        setCryptoPerf,
        p2pPerf,
        setP2PPerf,
        taxLiability,
        setTaxLiability,
      }}>
      {children ? children : <CalcTemplate />}
    </FIGoalContext.Provider>
  );
}

export { FIGoalContext, FIGoalContextProvider };
