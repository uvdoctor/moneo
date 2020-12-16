import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { CreateGoalInput, LMH, TargetInput } from "../../api/goals";
import { CalcContext, getCareTabOption } from "../calc/CalcContext";
import CalcTemplate from "../calc/CalcTemplate";
import FIAgeResult from "../calc/FIYearResult";
import FISavingsResult from "../calc/FISavingsResult";
import { findEarliestFFYear, isFFPossible } from "./cfutils";
import { COLORS } from "../../CONSTANTS";

const FIGoalContext = createContext({});
interface FIGoalContextProviderProps {
  children?: ReactNode;
  mustCFs: Array<number>;
  tryCFs: Array<number>;
  mergedCFs: any;
  pp?: Object;
}

function FIGoalContextProvider({ children, mustCFs, tryCFs, mergedCFs, pp }: FIGoalContextProviderProps) {
  const {
    goal,
    currency,
    inputTabIndex,
    setInputTabIndex,
    rr,
    setCFs,
    dr,
    setRR,
    setCreateNewGoalInput,
    endYear,
    inputTabs,
    setInputTabs,
    ffResult,
    setFFResult,
    setResults,
    hasTab,
    allInputDone
  }: any = useContext(CalcContext);
  const [riskProfile, setRiskProfile] = useState<LMH>(goal.imp);
  const [expenseBY, setExpenseBY] = useState<number>(goal.sy);
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
  const [monthlySavingsRate, setMonthlySavingsRate] = useState<number>(
    goal?.tbr as number
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
  const [gains, setGains] = useState<Array<TargetInput>>(
    goal.pg as Array<TargetInput>
  );
  const [losses, setLosses] = useState<Array<TargetInput>>(
    goal.pl as Array<TargetInput>
  );
  const careTabIndex = 4;
  const careTabLabel = "Care";

  const createGoal = () => {
    return {
      name: goal.name,
      sy: expenseBY,
      ey: endYear,
      by: goal.by,
      ra: nw,
      rachg: avgMonthlySavings,
      tdr: taxRate,
      tdl: careTaxDedLimit,
      ccy: currency,
      type: goal.type,
      imp: riskProfile,
      manual: 0,
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
      pg: gains,
      pl: losses,
      tdli: expenseAfterFF,
      btr: expenseChgRate,
      tbr: monthlySavingsRate,
    } as CreateGoalInput;
  };
  
  useEffect(() => {
    setCreateNewGoalInput(createGoal);
  }, []);
  
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
    setResults([...isFFPossible(ffResult, leaveBehind)
      ? [
        <FIAgeResult />,
        <FISavingsResult />
      ]
      : [
        <label style={{ color: COLORS.RED }}>
          Financial Independence May not be possible till You turn 70. Please try again with different Inputs.
          </label>
      ]]);
  }, [rr]);

  useEffect(() => {
    if (!allInputDone) return;
    let result = findEarliestFFYear(
      createGoal(),
      mergedCFs,
      ffResult.ffYear ? ffResult.ffYear : null,
      mustCFs,
      tryCFs,
      pp ? pp : dr
    );
    setFFResult(result);
    setCFs([...Object.values(result.ffCfs)]);
    setRR([...result.rr]);
    console.log("FF Result is ", result);
  }, [
    expenseBY,
    endYear,
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
    expenseAfterFF,
    expenseChgRate,
    monthlySavingsRate,
    riskProfile,
    dr,
    allInputDone
  ]);

    return (
      <FIGoalContext.Provider
        value={{
          taxRate,
          setTaxRate,
          expenseBY,
          setExpenseBY,
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
          expenseAfterFF,
          setExpenseAfterFF,
          expenseChgRate,
          setExpenseChgRate,
          monthlySavingsRate,
          setMonthlySavingsRate,
          riskProfile,
          setRiskProfile
        }}>
        {children ? children : <CalcTemplate />}
      </FIGoalContext.Provider>
    );
}

export { FIGoalContext, FIGoalContextProvider };