import React, { useState, useEffect, Fragment } from "react";
import * as APIt from "../../api/goals";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import {
  initYearOptions,
  getRangeFactor,
  changeSelection,
  buildYearsArray,
} from "../utils";
import SelectInput from "../form/selectinput";
import { findEarliestFFYear } from "./cfutils";
import FFResult from "./ffresult";
import SVGChart from "../svgchart";
import LineChart from "./linechart";
import { getOrderByTabLabel, getTabLabelByOrder } from "./goalutils";
import SVGBarChart from "../svgbarchart";
import StickyHeader from "./stickyheader";
import ResultSection from "./resultsection";
import { FIInvest } from "./fiinvest";
import { ExpenseAfterFF } from "./expenseafterff";
import RetIncome from "./retincome";
import CareInsurance from "./careinsurance";
import Nominees from "./nominees";
import InputSection from "./inputsection";
import DynamicTgtInput from "../form/dynamictgtinput";
import Section from "../form/section";
import TreeMapChart from "./treemapchart";
import SVGAAChart from "./svgaachart";
import AAChart from "./aachart";
import SVGPiggy from "../svgpiggy";
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGCashFlow from "../svgcashflow";
import SVGInheritance from "./svginheritance";
import SVGCare from "./svgcare";
import SVGPay from "../svgpay";
import { PLAN_DURATION } from "../../CONSTANTS";
interface FFGoalProps {
  goal: APIt.CreateGoalInput;
  ffResult: any | null;
  mustCFs: Array<number>;
  tryCFs: Array<number>;
  mergedCfs: any;
  pp: Object;
  ffResultHandler: Function;
  cancelCallback: Function;
  addCallback?: Function;
  updateCallback?: Function;
}

export default function FFGoal({
  goal,
  ffResult,
  mustCFs,
  tryCFs,
  mergedCfs,
  pp,
  ffResultHandler,
  cancelCallback,
  addCallback,
  updateCallback,
}: FFGoalProps) {
  const nowYear = new Date().getFullYear();
  const [riskProfile, setRiskProfile] = useState<APIt.LMH>(goal.imp);
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
  const [currency, setCurrency] = useState<string>(goal.ccy);
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
  const [rangeFactor, setRangeFactor] = useState<number>(
    getRangeFactor(currency)
  );
  const [gains, setGains] = useState<Array<APIt.TargetInput>>(
    goal.pg as Array<APIt.TargetInput>
  );
  const [losses, setLosses] = useState<Array<APIt.TargetInput>>(
    goal.pl as Array<APIt.TargetInput>
  );
  const [currentOrder, setCurrentOrder] = useState<number>(-1);
  const [allInputDone, setAllInputDone] = useState<boolean>(
    goal.id ? true : false
  );
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const investLabel = "Invest";
  const spendLabel = "Spend";
  const benefitLabel = "Benefit";
  const careLabel = "Care";
  const expectLabel = "Expect";
  const giveLabel = "Give";
  const cfChartLabel = "Savings";
  const aaFutureLabel = "Allocation Plan";
  const aaNextYearLabel = "Asset Allocation";
  const [chartFullScreen, setChartFullScreen] = useState<boolean>(false);
  const careOption = {
    label: careLabel,
    order: 11,
    active: true,
    svg: SVGCare,
  };
  const [tabOptions, setTabOptions] = useState<Array<any>>([
    { label: investLabel, order: 1, active: true, svg: SVGPiggy },
    { label: spendLabel, order: 5, active: true, svg: SVGPay },
    { label: benefitLabel, order: 8, active: true, svg: SVGTaxBenefit },
    careOption,
    { label: expectLabel, order: 16, active: true, svg: SVGCashFlow },
    { label: giveLabel, order: 18, active: true, svg: SVGInheritance },
  ]);

  const resultTabOptions = [
    {
      label: aaNextYearLabel,
      order: 1,
      active: true,
      svg: SVGAAChart,
      svglabel: nowYear + 1,
    },
    {
      label: aaFutureLabel,
      order: 2,
      active: true,
      svg: SVGBarChart,
      svglabel: `${nowYear + 2} - ${endYear}`,
    },
    {
      label: cfChartLabel,
      order: 3,
      active: true,
      svg: SVGChart,
    },
  ];

  const [showTab, setShowTab] = useState(investLabel);
  const [showResultTab, setShowResultTab] = useState<string>(aaNextYearLabel);

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
    let careTab = tabOptions.filter((tab) => tab.label === careLabel);
    return careTab && careTab.length === 1;
  };

  useEffect(() => {
    if (currency === "USD" || currency === "CAD" || currency === "GBP") {
      if (!hasCareTab()) {
        tabOptions.splice(3, 0, careOption);
        setTabOptions([...tabOptions]);
      }
    } else {
      if (hasCareTab()) {
        tabOptions.splice(3, 1);
        setTabOptions([...tabOptions]);
        if (showTab === careLabel) {
          setShowTab(expectLabel);
          setCarePremium(0);
          if (!allInputDone)
            setCurrentOrder(getOrderByTabLabel(tabOptions, expectLabel));
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
      pp
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
    allInputDone,
  ]);

  const handleSubmit = async () => {
    setBtnClicked(true);
    if (addCallback && updateCallback) {
      goal.id
        ? await updateCallback(updateGoal())
        : await addCallback(createGoal());
    } else cancelCallback();
    setBtnClicked(false);
  };

  const changeCurrency = (curr: string) => {
    setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
    setCurrency(curr);
  };

  const handleNextStep = (count: number = 1) => {
    if (allInputDone) return;
    let co = currentOrder + count;
    if (co === 11 && !hasCareTab()) co += 5;
    let label = getTabLabelByOrder(tabOptions, co);
    if (label) setShowTab(label);
    setCurrentOrder(co);
    if (label === giveLabel) setAllInputDone(true);
  };

  const buildChartCFs = (ffCfs: Object) => Object.values(ffCfs);

  const showResultSection = () =>
    allInputDone && ffResult.rr && ffResult.rr.length > 0;

  return (
    <div className="w-full h-full">
      <StickyHeader cancelCallback={cancelCallback} cancelDisabled={btnClicked}>
        <SelectInput
          name="ey"
          //info="Financial Plan will be created assuming that You live till 100 Years, after which You leave behind inheritance.
          //DollarDarwin will try to find the earliest possible year for Your Financial Independence based on Your inputs and Other Goals that You Create.
          //Given that You May not be able to work beyond 70 years of age, DollarDarwin may request You to reconsider Your inputs and other Goals so that You Achieve Financial Independence before hitting 70."
          inputOrder={-1}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={handleNextStep}
          pre="Birth Year"
          value={endYear - PLAN_DURATION}
          changeHandler={(val: string) => changeSelection(val, setEndYear, 100)}
          options={eyOptions}
        />
        <SelectInput
          name="ccy"
          inputOrder={0}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={handleNextStep}
          pre="Currency"
          value={currency}
          changeHandler={changeCurrency}
          currency
        />
      </StickyHeader>
      <div
        className={`container mx-auto flex flex-1 lg:flex-row ${
          showResultSection() && "flex-col-reverse"
        } items-start`}
      >
        <InputSection
          currentOrder={currentOrder}
          allInputDone={allInputDone}
          showTab={showTab}
          showTabHandler={setShowTab}
          tabOptions={tabOptions}
          cancelCallback={cancelCallback}
          handleSubmit={handleSubmit}
          submitDisabled={!allInputDone || expenseAfterFF < 5000 || btnClicked}
          cancelDisabled={btnClicked}
          calc={!addCallback && !updateCallback}
        >
          {showTab === investLabel && (
            <FIInvest
              currency={currency}
              riskProfile={riskProfile}
              riskProfileHandler={setRiskProfile}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              inputOrder={getOrderByTabLabel(tabOptions, investLabel)}
              nextStepHandler={handleNextStep}
              nw={nw}
              nwHandler={setNW}
              avgMonthlySavings={avgMonthlySavings}
              avgMonthlySavingsHandler={setAvgMonthlySavings}
              monthlySavingsRate={monthlySavingsRate}
              monthlySavingsRateHandler={setMonthlySavingsRate}
            />
          )}

          {showTab === spendLabel && (
            <ExpenseAfterFF
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, spendLabel)}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              nextStepHandler={handleNextStep}
              expenseAfterFF={expenseAfterFF}
              expenseAfterFFHandler={setExpenseAfterFF}
              expenseChgRate={expenseChgRate}
              expenseChgRateHandler={setExpenseChgRate}
              taxRate={taxRate}
              taxRateHandler={setTaxRate}
              expenseBYHandler={setExpenseBY}
            />
          )}

          {showTab === benefitLabel && (
            <RetIncome
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, benefitLabel)}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              nextStepHandler={handleNextStep}
              retirementIncome={retirementIncome}
              retirementIncomeHandler={setRetirementIncome}
              retirementIncomePer={retirementIncomePer}
              retirementIncomePerHandler={setRetirementIncomePer}
              retirementIncomeSY={retirementIncomeSY}
              retirementIncomeSYHandler={setRetirementIncomeSY}
              endYear={endYear}
            />
          )}

          {showTab === careLabel && (
            <CareInsurance
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, careLabel)}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              nextStepHandler={handleNextStep}
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

          {showTab === expectLabel && (
            <Fragment>
              <Section
                title="Potential Gains (eg: Inheritance, Selling Investments, etc.)"
                left={
                  <DynamicTgtInput
                    inputOrder={getOrderByTabLabel(tabOptions, expectLabel)}
                    currentOrder={currentOrder}
                    allInputDone={allInputDone}
                    nextStepHandler={handleNextStep}
                    startYear={goal.by}
                    endYear={endYear}
                    currency={currency}
                    rangeFactor={rangeFactor}
                    tgts={gains}
                    tgtsHandler={setGains}
                  />
                }
                insideForm
                footer="Exclude taxes & fees."
              />

              {(allInputDone ||
                currentOrder ===
                  getOrderByTabLabel(tabOptions, expectLabel) + 1) && (
                <Section
                  title="Potential Losses (eg: Inheritance, Selling Investments, etc.)"
                  footer="Include taxes & fees."
                  insideForm
                  left={
                    <DynamicTgtInput
                      inputOrder={
                        getOrderByTabLabel(tabOptions, expectLabel) + 1
                      }
                      currentOrder={currentOrder}
                      allInputDone={allInputDone}
                      nextStepHandler={handleNextStep}
                      startYear={goal.by}
                      endYear={endYear}
                      currency={currency}
                      rangeFactor={rangeFactor}
                      tgts={losses}
                      tgtsHandler={setLosses}
                    />
                  }
                />
              )}
            </Fragment>
          )}

          {showTab === giveLabel && (
            <Nominees
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, giveLabel)}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              nextStepHandler={handleNextStep}
              leaveBehind={leaveBehind}
              leaveBehindHandler={setLeaveBehind}
              successionTaxRate={successionTaxRate}
              successionTaxRateHandler={setSuccessionTaxRate}
              endYear={endYear}
            />
          )}
        </InputSection>

        {showResultSection() && (
          <ResultSection
            resultTabOptions={resultTabOptions}
            showResultTab={showResultTab}
            showResultTabHandler={setShowResultTab}
            chartFullScreenHandler={(fs: boolean) => setChartFullScreen(!fs)}
            result={
              <FFResult
                endYear={endYear}
                result={ffResult}
                ffNomineeAmt={leaveBehind}
                currency={currency}
              />
            }
          >
            <TreeMapChart
              aa={ffResult.aa}
              rr={ffResult.rr}
              fullScreen={chartFullScreen}
            />
            <AAChart
              aa={ffResult.aa}
              years={buildYearsArray(nowYear + 2, endYear)}
              rr={ffResult.rr}
              fullScreen={chartFullScreen}
            />
            <LineChart
              cfs={buildChartCFs(ffResult.ffCfs)}
              startYear={nowYear + 1}
              fullScreen={chartFullScreen}
            />
          </ResultSection>
        )}
      </div>
    </div>
  );
}
