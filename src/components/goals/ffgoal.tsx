import React, { useState, useEffect } from "react";
import * as APIt from "../../api/goals";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { initYearOptions, getRangeFactor, changeSelection, buildYearsArray } from "../utils";
import SelectInput from "../form/selectinput";
import { findEarliestFFYear } from "./cfutils";
import FFResult from "./ffresult";
import SVGChart from "../svgchart";
import LineChart from "./linechart";
import { getOrderByTabLabel, getTabLabelByOrder } from "./goalutils";
import SVGBarChart from "../svgbarchart";
import StickyHeader from "./stickyheader";
import ResultSection from "./resultsection";
import { Invest } from "./invest";
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
interface FFGoalProps {
  goal: APIt.CreateGoalInput;
  totalSavings: number;
  annualSavings: number;
  avgAnnualExp: number;
  expChgRate: number;
  ffYear: number | null;
  ffAmt: number;
  ffLeftOverAmt: number;
  ffCfs: any;
  ffMinReq: number;
  ffOOM: Array<number> | null;
  aa: Object;
  rr: Array<number>;
  mustCFs: Array<number>;
  tryCFs: Array<number>;
  mergedCfs: any;
  pp: Object;
  aaHandler: Function;
  rrHandler: Function;
  ffYearHandler: Function;
  ffAmtHandler: Function;
  ffLeftOverAmtHandler: Function;
  ffCfsHandler: Function;
  ffMinReqHandler: Function;
  ffOOMHandler: Function;
  cancelCallback: Function;
  addCallback: Function;
  updateCallback: Function;
}

export default function FFGoal({
  goal,
  totalSavings,
  annualSavings,
  avgAnnualExp,
  expChgRate,
  ffYear,
  ffAmt,
  ffLeftOverAmt,
  ffCfs,
  ffMinReq,
  ffOOM,
  aa,
  rr,
  mustCFs,
  tryCFs,
  mergedCfs,
  pp,
  aaHandler,
  rrHandler,
  ffYearHandler,
  ffAmtHandler,
  ffLeftOverAmtHandler,
  ffCfsHandler,
  ffMinReqHandler,
  ffOOMHandler,
  cancelCallback,
  addCallback,
  updateCallback,
}: FFGoalProps) {
  const [riskProfile, setRiskProfile] = useState<APIt.LMH>(goal.imp);
  const [expenseBY, setExpenseBY] = useState<number>(goal.sy);
  const [expenseAfterFF, setExpenseAfterFF] = useState<number>(
    goal?.tdli as number
  );
  const [expenseChgRate, setExpenseChgRate] = useState<number>(
    goal?.btr as number
  );
  const [monthlySavingsRate, setMonthlySavingsRate] = useState<number>(
    goal?.tbr as number
  );
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const eyOptions = initYearOptions(goal.by + 30, 50);
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
  const nowYear = new Date().getFullYear();
  const [currentOrder, setCurrentOrder] = useState<number>(1);
  const [allInputDone, setAllInputDone] = useState<boolean>(
    goal.id ? true : false
  );
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const investLabel = "Invest";
  const expLabel = "Expenses";
  const incomeLabel = "Income";
  const careLabel = "Care";
  const gainsLabel = "Gains";
  const lossesLabel = "Losses";
  const nomineeLabel = "Nominees";
  const cfChartLabel = "Total Savings";
  const aaChartLabel = `Where to Invest from ${nowYear + 2} onwards?`;
  const treemapChartLabel = `Where to Invest in ${nowYear + 1}?`;
  const [chartFullScreen, setChartFullScreen] = useState<boolean>(false);

  const [tabOptions, setTabOptions] = useState<Array<any>>([
    { label: investLabel, order: 3, active: true },
    { label: expLabel, order: 5, active: true },
    { label: incomeLabel, order: 8, active: true },
    { label: careLabel, order: 11, active: true },
    { label: gainsLabel, order: 16, active: true },
    { label: lossesLabel, order: 17, active: true },
    { label: nomineeLabel, order: 18, active: true },
  ]);

  const resultTabOptions = [
    {
      label: treemapChartLabel,
      order: 1,
      active: true,
      svg: <SVGAAChart />,
    },
    {
      label: aaChartLabel,
      order: 2,
      active: true,
      svg: <SVGBarChart />,
    },
    {
      label: cfChartLabel,
      order: 3,
      active: true,
      svg: <SVGChart />,
    },
  ];

  const [showTab, setShowTab] = useState(investLabel);
  const [showResultTab, setShowResultTab] = useState<string>(treemapChartLabel);

  const createGoal = () => {
    return {
      name: goal.name,
      sy: expenseBY,
      ey: endYear,
      by: goal.by,
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

  const isFFResultAcceptable = (result: any) => {
    if (!result.ffYear || result.ffYear < 0) return false;
    if (!result.oom || result.oom.length === 0) return true;
    result.oom.forEach((y: number) => {
      if (y >= result.ffYear) return false;
    });
    return true;
  };

  const hasCareTab = () => {
    let careTab = tabOptions.filter((tab) => tab.label === careLabel);
    return careTab && careTab.length === 1;
  };

  useEffect(() => {
    if (currency === "USD" || currency === "CAD" || currency === "GBP") {
      if (!hasCareTab()) {
        tabOptions.splice(3, 0, {
          label: careLabel,
          order: 11,
          active: true,
        });
        tabOptions[4].order = 16;
        tabOptions[5].order = 17;
        tabOptions[6].order = 18;
        setTabOptions([...tabOptions]);
      }
    } else {
      if (hasCareTab()) {
        tabOptions.splice(3, 1);
        setTabOptions([...tabOptions]);
      }
    }
  }, [currency]);

  useEffect(() => {
    if (!allInputDone) return;
    let result = findEarliestFFYear(
      createGoal(),
      totalSavings,
      mergedCfs,
      annualSavings,
      ffYear ? ffYear : null,
      mustCFs,
      tryCFs,
      avgAnnualExp,
      expChgRate,
      pp
    );
    ffAmtHandler(result.ffAmt);
    ffYearHandler(!isFFResultAcceptable(result) ? null : result.ffYear);
    ffLeftOverAmtHandler(result.leftAmt);
    ffCfsHandler(result.ffCfs);
    aaHandler(result.aa);
    rrHandler([...result.rr]);
    ffMinReqHandler(result.minReq);
    ffOOMHandler(result.oom);
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
    totalSavings,
    annualSavings,
    expenseAfterFF,
    expenseChgRate,
    monthlySavingsRate,
    riskProfile,
    allInputDone,
  ]);

  const handleSubmit = async () => {
    setBtnClicked(true);
    goal.id
      ? await updateCallback(updateGoal())
      : await addCallback(createGoal());
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
    if (label === nomineeLabel) setAllInputDone(true);
  };

  const buildChartCFs = (ffCfs: Object) => Object.values(ffCfs);

  const showResultSection = () => allInputDone && rr && rr.length > 0;

  return (
    <div className="w-full h-full">
      <StickyHeader cancelCallback={cancelCallback} cancelDisabled={btnClicked}>
        <SelectInput
          name="ey"
          info="Select the Year till You Want to Plan. After this Year, it is assumed that You will leave behind inheritance for Your Nominees, if any."
          inputOrder={1}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={handleNextStep}
          pre="Plan End Year"
          value={endYear}
          changeHandler={(val: string) => changeSelection(val, setEndYear)}
          options={eyOptions}
        />
        <SelectInput
          name="ccy"
          inputOrder={2}
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
        >
          {showTab === investLabel && (
            <Invest
              currency={currency}
              riskProfile={riskProfile}
              riskProfileHandler={setRiskProfile}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              inputOrder={getOrderByTabLabel(tabOptions, investLabel)}
              nextStepHandler={handleNextStep}
              annualSavings={annualSavings}
              monthlySavingsRate={monthlySavingsRate}
              monthlySavingsRateHandler={setMonthlySavingsRate}
            />
          )}

          {showTab === expLabel && (
            <ExpenseAfterFF
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, expLabel)}
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

          {showTab === incomeLabel && (
            <RetIncome
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, incomeLabel)}
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

          {showTab === gainsLabel && (
            <Section
              title="Potential Gains (eg: Inheritance, Selling Investments, etc.)"
              left={
                <DynamicTgtInput
                  inputOrder={getOrderByTabLabel(tabOptions, gainsLabel)}
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
          )}

          {showTab === lossesLabel && (
            <Section
              title="Potential Losses (eg: Inheritance, Selling Investments, etc.)"
              footer="Include taxes & fees."
              insideForm
              left={
                <DynamicTgtInput
                  inputOrder={getOrderByTabLabel(tabOptions, lossesLabel)}
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

          {showTab === nomineeLabel && (
            <Nominees
              currency={currency}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, nomineeLabel)}
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
                ffAmt={ffAmt}
                ffLeftOverAmt={ffLeftOverAmt}
                ffYear={ffYear}
                ffMinReq={ffMinReq}
                ffNomineeAmt={leaveBehind}
                ffOOM={ffOOM}
                currency={currency}
              />
            }
          >
            <TreeMapChart aa={aa} rr={rr} />
            <AAChart
              aa={aa}
              years={buildYearsArray(nowYear + 2, endYear)}
              rr={rr}
              fullScreen={chartFullScreen}
            />
            <LineChart
              cfs={buildChartCFs(ffCfs)}
              startYear={nowYear + 1}
              fullScreen={chartFullScreen}
            />
          </ResultSection>
        )}
      </div>
    </div>
  );
}
