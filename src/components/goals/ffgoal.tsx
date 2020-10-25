import React, { useState, useEffect, Fragment, useContext } from "react";
import * as APIt from "../../api/goals";
import {
  initYearOptions,
  changeSelection,
  buildYearsArray,
  isTopBottomLayout,
} from "../utils";
import SelectInput from "../form/selectinput";
import { findEarliestFFYear } from "./cfutils";
import FFResult from "./ffresult";
import DDLineChart from "./DDLineChart";
import { getAge } from "./goalutils";
import Result from "./Result";
import { FIInvest } from "./fiinvest";
import { ExpenseAfterFF } from "./expenseafterff";
import RetIncome from "./retincome";
import CareInsurance from "./careinsurance";
import Nominees from "./nominees";
import Input from "./Input";
import DynamicTgtInput from "../form/dynamictgtinput";
import Section from "../form/section";
import AssetAllocationChart from "./AssetAllocationChart";
import AAPlanChart from "./AAPlanChart";
import { PLAN_DURATION } from "../../CONSTANTS";
import { Space } from "antd";
import SVGCare from "./svgcare";
import { GoalContext } from "./GoalContext";
interface FFGoalProps {
  ffResult: any | null;
  mustCFs: Array<number>;
  tryCFs: Array<number>;
  mergedCfs: any;
  pp?: Object;
  ffResultHandler: Function;
}

export const INVEST_LABEL = "Invest";
export const SPEND_LABEL = "Spend";
export const BENEFIT_LABEL = "Benefit";
export const CARE_LABEL = "Care";
export const EXPECT_LABEL = "Expect";
export const GIVE_LABEL = "Give";
export const CF_CHART_LABEL = "Total Portfolio";
export const AA_FUTURE_CHART_LABEL = "Allocation Plan";
export const AA_NEXT_YEAR_CHART_LABEL = "Asset Allocation";

export const getCareTabOption = () => {
  return {
      label: CARE_LABEL,
      active: true,
      svg: SVGCare,
  }
}

export default function FFGoal({
  ffResult,
  mustCFs,
  tryCFs,
  mergedCfs,
  pp,
  ffResultHandler,
}: FFGoalProps) {
  const { goal, fsb, allInputDone, inputTabs, setInputTabs, showTab, setShowTab, showResultTab, currency, rangeFactor, cancelCalc, addCallback, updateCallback }: any = useContext(GoalContext);
  const nowYear = new Date().getFullYear();
  const [riskProfile, setRiskProfile] = useState<APIt.LMH>(goal.imp);
  const [rr, setRR] = useState<number | null>(pp ? null : 5);
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
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const eyOptions = initYearOptions(1960, nowYear - 15 - 1960);
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
  const [gains, setGains] = useState<Array<APIt.TargetInput>>(
    goal.pg as Array<APIt.TargetInput>
  );
  const [losses, setLosses] = useState<Array<APIt.TargetInput>>(
    goal.pl as Array<APIt.TargetInput>
  );
  const [btnClicked, setBtnClicked] = useState<boolean>(false);

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
    } as APIt.CreateGoalInput;
  };

  const updateGoal = () => {
    let g: APIt.CreateGoalInput = createGoal();
    g.id = goal.id;
    return g as APIt.UpdateGoalInput;
  };

  const hasCareTab = () => {
    let careTab = inputTabs.filter((tab: any) => tab.label === CARE_LABEL);
    return careTab && careTab.length === 1;
  };

  useEffect(() => {
    if (currency === "USD" || currency === "CAD" || currency === "GBP") {
      if (!hasCareTab()) {
        inputTabs.splice(3, 0, getCareTabOption());
        setInputTabs([...inputTabs]);
      }
    } else {
      if (hasCareTab()) {
        inputTabs.splice(3, 1);
        setInputTabs([...inputTabs]);
        if (showTab === CARE_LABEL) {
          setShowTab(EXPECT_LABEL);
          setCarePremium(0);
        }
      }
    }
  }, [currency]);

  useEffect(() => {
    if (!allInputDone) return;
    let result = findEarliestFFYear(
      createGoal(),
      mergedCfs,
      ffResult.ffYear ? ffResult.ffYear : null,
      mustCFs,
      tryCFs,
      pp ? pp : rr
    );
    ffResultHandler(result);
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
    rr,
    allInputDone,
  ]);

  const handleSubmit = async () => {
    setBtnClicked(true);
    if (addCallback && updateCallback) {
      goal.id
        ? await updateCallback(updateGoal())
        : await addCallback(createGoal());
    } else cancelCalc();
    setBtnClicked(false);
  };

  const buildChartCFs = (ffCfs: Object) => Object.values(ffCfs);

  const showResultSection = () =>
    allInputDone && ffResult.rr && ffResult.rr.length > 0;

  return (
    <Space align="center" direction="vertical">
        <SelectInput
          //info="Financial Plan will be created assuming that You live till 100 Years, after which You leave behind inheritance.
          //DollarDarwin will try to find the earliest possible year for Your Financial Independence based on Your inputs and Other Goals that You Create.
          //Given that You May not be able to work beyond 70 years of age, DollarDarwin may request You to reconsider Your inputs and other Goals so that You Achieve Financial Independence before hitting 70."
          pre="Birth Year"
          value={endYear - PLAN_DURATION}
          changeHandler={(val: string) => changeSelection(val, setEndYear, 100)}
          options={eyOptions}
        />
      <Space
			align="start"
			size="large"
        style={{ width: '100%' }}
        //@ts-ignore
			direction={`${isTopBottomLayout(fsb) ? 'vertical' : 'horizontal'}`}
		>  <Input
          handleSubmit={addCallback && updateCallback ? handleSubmit : null}
          submitDisabled={!allInputDone || expenseAfterFF < 5000 || btnClicked}
        >
          {showTab === INVEST_LABEL && (
            <FIInvest
              currency={currency}
              riskProfile={pp ? riskProfile : null}
              riskProfileHandler={pp ? setRiskProfile : null}
              rr={rr}
              rrHandler={pp ? null : setRR}
              nw={nw}
              nwHandler={setNW}
              avgMonthlySavings={avgMonthlySavings}
              avgMonthlySavingsHandler={setAvgMonthlySavings}
              monthlySavingsRate={monthlySavingsRate}
              monthlySavingsRateHandler={setMonthlySavingsRate}
            />
          )}

          {showTab === SPEND_LABEL && (
            <ExpenseAfterFF
              currency={currency}
              rangeFactor={rangeFactor}
              expenseAfterFF={expenseAfterFF}
              expenseAfterFFHandler={setExpenseAfterFF}
              expenseChgRate={expenseChgRate}
              expenseChgRateHandler={setExpenseChgRate}
              taxRate={taxRate}
              taxRateHandler={setTaxRate}
              expenseBYHandler={setExpenseBY}
            />
          )}

          {showTab === BENEFIT_LABEL && (
            <RetIncome
              currency={currency}
              rangeFactor={rangeFactor}
              retirementIncome={retirementIncome}
              retirementIncomeHandler={setRetirementIncome}
              retirementIncomePer={retirementIncomePer}
              retirementIncomePerHandler={setRetirementIncomePer}
              retirementIncomeSY={retirementIncomeSY}
              retirementIncomeSYHandler={setRetirementIncomeSY}
              endYear={endYear}
            />
          )}

          {showTab === CARE_LABEL && (
            <CareInsurance
              currency={currency}
              rangeFactor={rangeFactor}
              carePremium={carePremium}
              carePremiumHandler={setCarePremium}
              carePremiumSY={carePremiumSY}
              carePremiumSYHandler={setCarePremiumSY}
              premiumDur={carePremiumDur}
              premiumDurHandler={setCarePremiumDur}
              maxTaxDed={careTaxDedLimit}
              maxTaxDedHandler={setCareTaxDedLimit}
              cpBY={cpBY}
              chgPer={carePremiumChgPer}
              chgPerHandler={setCarePremiumChgPer}
              taxRate={taxRate}
              endYear={endYear}
              cpBYHandler={setCPBY}
            />
          )}

          {showTab === EXPECT_LABEL && (
            <Fragment>
              <Section
                title="Potential Gains (eg: Inheritance, Selling Investments, etc.)"
                footer="Exclude taxes & fees.">
                  <DynamicTgtInput
                    startYear={goal.by}
                    endYear={endYear}
                    currency={currency}
                    rangeFactor={rangeFactor}
                    tgts={gains}
                    tgtsHandler={setGains}
                  />
              </Section>

                <Section
                  title="Potential Losses (eg: Inheritance, Selling Investments, etc.)"
                  footer="Include taxes & fees.">
                    <DynamicTgtInput
                      startYear={goal.by}
                      endYear={endYear}
                      currency={currency}
                      rangeFactor={rangeFactor}
                      tgts={losses}
                      tgtsHandler={setLosses}
                    />
                </Section>
            </Fragment>
          )}

          {showTab === GIVE_LABEL && (
            <Nominees
              currency={currency}
              rangeFactor={rangeFactor}
              leaveBehind={leaveBehind}
              leaveBehindHandler={setLeaveBehind}
              successionTaxRate={successionTaxRate}
              successionTaxRateHandler={setSuccessionTaxRate}
              endYear={endYear}
            />
          )}
        </Input>

        {showResultSection() && (
          <Result
            results={[
              <FFResult
                endYear={endYear}
                result={ffResult}
                ffNomineeAmt={leaveBehind}
                currency={currency}
              />
            ]}
          >
            {pp && showResultTab === AA_NEXT_YEAR_CHART_LABEL &&
              <AssetAllocationChart
                aa={ffResult.aa}
                rr={ffResult.rr}
              />}
                {pp && showResultTab === AA_FUTURE_CHART_LABEL && <AAPlanChart
                  aa={ffResult.aa}
                  years={buildYearsArray(nowYear + 2, endYear)}
                  rr={ffResult.rr}
                />}
            {showResultTab === CF_CHART_LABEL && <DDLineChart
              //cfs={buildChartCFs(ffResult.ffCfs)}
              firstYear={getAge(nowYear + 1, endYear)}
              title="Age"
            />}
          </Result>
        )}
      </Space>
    </Space>
  );
}
