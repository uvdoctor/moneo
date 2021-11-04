import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { CreateGoalInput, LMH, LoanType, TargetInput } from "../../api/goals";
import { CalcContext, getCareTabOption } from "../calc/CalcContext";
import CalcTemplate from "../calc/CalcTemplate";
import FIYearResult from "../calc/FIYearResult";
import FISavingsResult from "../calc/FISavingsResult";
import { findEarliestFFYear, isFFPossible } from "./cfutils";
import { PlanContext } from "./PlanContext";

const FIGoalContext = createContext({});
interface FIGoalContextProviderProps {
  children?: ReactNode;
}

function FIGoalContextProvider({ children }: FIGoalContextProviderProps) {
  const { mustCFs, tryCFs, mergedCFs, pp, dr, ffYear, isPublicCalc }: any = useContext(PlanContext);
  const {
    goal,
    currency,
    inputTabIndex,
    setInputTabIndex,
    setCFs,
    startYear,
    endYear,
    inputTabs,
    setInputTabs,
    resultTabs,
    setResultTabs,
    resultTabIndex,
    setResultTabIndex,
    setResults,
    hasTab,
    allInputDone,
    setError,
    cfs,
    setWipGoal
  }: any = useContext(CalcContext);
  const [riskProfile, setRiskProfile] = useState<LMH>(goal.imp);
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
  const [needTEBonds, setNeedTEBonds] = useState<number>(goal.tdr);
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
  const [gains, setGains] = useState<Array<TargetInput>>(
    goal.pg
  );
  const [losses, setLosses] = useState<Array<TargetInput>>(
    goal.pl
  );
  const careTabIndex = 4;
  const careTabLabel = "Care";
  const [retirementAge, setRetirementAge] = useState<number>(goal.loan?.rate);
  const [planDuration, setPlanDuration] = useState<number>(goal.loan?.dur);
  const [wipResult, setWipResult] = useState<any>({});
  
  const getLatestGoalState = () => {
    let g: CreateGoalInput =  {
      name: goal.name,
      by: goal.by,
      sy: startYear,
      ey: endYear,
      ra: nw,
      rachg: avgMonthlySavings,
      tdr: taxRate,
      manual: needTEBonds,
      tdl: careTaxDedLimit,
      ccy: currency,
      type: goal.type,
      imp: riskProfile,
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
        pmi: monthlyMaxSavings
      }
    }
    if (goal.id) g.id = goal.id;
    return g;
  };
  
  useEffect(() => {
    if (currency === "USD" || currency === "CAD" || currency === "GBP") {
      if (!hasTab(careTabLabel)) {
        inputTabs.splice(careTabIndex, 0, getCareTabOption());
        setInputTabs([...inputTabs]);
      }
    } else {
      if (hasTab(careTabLabel)) {
        inputTabs.splice(careTabIndex, 1);
        setInputTabs([...inputTabs]);
        setCarePremium(0);
        if (inputTabIndex === inputTabs.length) setInputTabIndex(careTabIndex);
      }
    }
  }, [currency]);

  useEffect(() => {
    setResults([...[
        <FIYearResult key="fiyear" />,
        <FISavingsResult key="fiamt" />
      ]]);
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
    let result: any = findEarliestFFYear(
      g,
      mergedCFs,
      ffYear,
      mustCFs,
      tryCFs,
      isPublicCalc ? dr : pp()
    );
    if (!isFFPossible(result, leaveBehind)) {
      setError(`Please try again with different inputs / goals so that Financial Independence is Achievable by Age of ${retirementAge}.`);
    } else {
      setError("");
    }
    setWipResult(result);
    setCFs([...Object.values(result.ffCfs)]);
    console.log("FF Result is ", result);
  }, [
    startYear,
    endYear,
    taxRate,
    needTEBonds,
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
    allInputDone
  ]);

    return (
      <FIGoalContext.Provider
        value={{
          needTEBonds,
          setNeedTEBonds,
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
          wipResult
        }}>
        {children ? children : <CalcTemplate />}
      </FIGoalContext.Provider>
    );
}

export { FIGoalContext, FIGoalContextProvider };