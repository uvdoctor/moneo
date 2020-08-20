import React, { useState, useEffect, Fragment } from "react";
import SelectInput from "../form/selectinput";
import TextInput from "../form/textinput";
import NumberInput from "../form/numberinput";
import * as APIt from "../../api/goals";
import { initYearOptions, getRangeFactor } from "../utils";
import EmiCost from "../calc/emicost";
import HToggle from "../horizontaltoggle";
import TaxBenefit from "../calc/taxbenefit";
import Section from "../form/section";
import Sell from "./sell";
import StickyHeader from "./stickyheader";
import SVGChart from "../svgchart";
import Cost from "./cost";
import { calculateCFs, getLoanBorrowAmt } from "./cfutils";
import { getDuration, getGoalTypes, getImpLevels } from "./goalutils";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import AnnualAmt from "./annualamt";
import SVGBalance from "../calc/svgbalance";
import { getCompoundedIncome } from "../calc/finance";
import SVGScale from "../svgscale";
import ResultSection from "./resultsection";
import GoalResult from "./goalresult";
import LineChart from "./linechart";
import BRComparison from "../calc/brcomparison";
import InputSection from "./inputsection";

interface GoalProps {
  goal: APIt.CreateGoalInput;
  cashFlows?: Array<number>;
  ffGoalEndYear: number;
  ffImpactYearsHandler: Function;
  cancelCallback: Function;
  addCallback: Function;
  updateCallback: Function;
}

export default function Goal({
  goal,
  cashFlows,
  ffGoalEndYear,
  ffImpactYearsHandler,
  cancelCallback,
  addCallback,
  updateCallback,
}: GoalProps) {
  const typesList = getGoalTypes();
  const goalType = goal?.type as APIt.GoalType;
  const [startYear, setStartYear] = useState<number>(goal.sy);
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const [syOptions] = useState(
    initYearOptions(goal.by + 1, ffGoalEndYear - 20 - (goal.by + 1))
  );
  const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 20));
  const [loanRepaymentSY, setLoanRepaymentSY] = useState<
    number | null | undefined
  >(goal?.emi?.ry);
  const [price, setPrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(goal?.tdr);
  const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(goal?.tdl);
  const [taxBenefitInt, setTaxBenefitInt] = useState<number | null | undefined>(
    goal?.tbi
  );
  const [maxTaxDeductionInt, setMaxTaxDeductionInt] = useState<
    number | null | undefined
  >(goal?.tdli);
  const [sellAfter, setSellAfter] = useState<number | undefined | null>(
    goal?.sa
  );
  const [loanPer, setLoanPer] = useState<number | undefined | null>(
    goal?.emi?.per
  );
  const [startingPrice, setStartingPrice] = useState<number>(
    goal?.cp as number
  );
  const [currency, setCurrency] = useState<string>(goal.ccy);
  const [impLevel, setImpLevel] = useState<APIt.LMH>(goal?.imp);
  const [manualMode, setManualMode] = useState<number>(goal?.manual);
  const [name, setName] = useState<string>(goal?.name);
  const [loanYears, setLoanYears] = useState<number | null | undefined>(
    goal?.emi?.dur
  );
  const [loanIntRate, setLoanIntRate] = useState<number | null | undefined>(
    goal?.emi?.rate
  );
  const [priceChgRate, setPriceChgRate] = useState<number>(goal?.chg as number);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [assetChgRate, setAssetChgRate] = useState<number | null | undefined>(
    goal?.achg
  );
  const [amCostPer, setAMCostPer] = useState<number | null | undefined>(
    goal?.amper
  );
  const [amStartYear, setAMStartYear] = useState<number | null | undefined>(
    goal?.amsy
  );
  const [aiPer, setAIPer] = useState<number | null | undefined>(goal?.aiper);
  const [aiStartYear, setAIStartYear] = useState<number | null | undefined>(
    goal?.aisy
  );
  const [rentTaxBenefit, setRentTaxBenefit] = useState<
    number | null | undefined
  >(goal?.tbr);
  const [cfs, setCFs] = useState<Array<number>>(cashFlows ? cashFlows : []);
  const [rentAmt, setRentAmt] = useState<number | null | undefined>(goal?.ra);
  const [rentChgPer, setRentChgPer] = useState<number | null | undefined>(
    goal?.rachg
  );
  const [answer, setAnswer] = useState<string>("");
  const [rentAns, setRentAns] = useState<string>("");
  const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(
    goal?.tgts as Array<APIt.TargetInput>
  );
  const [rangeFactor, setRangeFactor] = useState<number>(
    getRangeFactor(currency)
  );
  const [currentOrder, setCurrentOrder] = useState<number>(1);
  const [allInputDone, setAllInputDone] = useState<boolean>(
    goal.id ? true : false
  );
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [analyzeFor, setAnalyzeFor] = useState<number>(20);
  const [ffImpactYears, setFFImpactYears] = useState<number | null>(null);
  const [rr, setRR] = useState<Array<number>>([]);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const nowYear = new Date().getFullYear();
  const [showBRChart, setShowBRChart] = useState<boolean>(false);
  const amtLabel = "Amount";
  const taxLabel = "Tax";
  const sellLabel = "Sell";
  const loanLabel = "Loan";
  const earnLabel = "Earn";
  const maintainLabel = "Maintain";
  const rentLabel = "Rent?";
  const cfChartLabel = "Cash Flows";
  const brChartLabel = "Buy v/s Rent";
  const [chartFullScreen, setChartFullScreen] = useState<boolean>(false);

  const [tabOptions, setTabOptions] = useState<Array<any>>(
    goalType === APIt.GoalType.B
      ? [
          { label: amtLabel, order: 3, active: true },
          { label: taxLabel, order: 8, active: true },
          { label: loanLabel, order: 10, active: true },
          { label: maintainLabel, order: 15, active: true },
          { label: earnLabel, order: 17, active: true },
          { label: sellLabel, order: 19, active: true },
          { label: rentLabel, order: 21, active: true },
        ]
      : goalType === APIt.GoalType.D || goalType === APIt.GoalType.R
      ? [
          { label: amtLabel, order: 3, active: true },
          { label: taxLabel, order: 8, active: true },
        ]
      : [
          { label: amtLabel, order: 3, active: true },
          { label: taxLabel, order: 8, active: true },
          { label: loanLabel, order: 10, active: true },
        ]
  );
  const [showTab, setShowTab] = useState(amtLabel);
  const [showResultTab, setShowResultTab] = useState<string>(cfChartLabel);

  const isBRCompAvailable = () => sellAfter && price > 0 && !!rentAmt;

  const [resultTabOptions, setResultTabOptions] = useState<Array<any>>([
    {
      label: cfChartLabel,
      order: 1,
      active: true,
      svg: <SVGChart />,
    },
    {
      label: brChartLabel,
      order: 2,
      active: goal.id && !!rentAmt,
      svg: <SVGScale />,
    },
  ]);

  const createNewBaseGoal = () => {
    return {
      name: name,
      sy: startYear,
      ey: endYear,
      by: goal.by,
      tdr: taxRate,
      tdl: maxTaxDeduction,
      ccy: currency,
      cp: startingPrice,
      chg: priceChgRate,
      type: goalType,
      tgts: manualMode ? wipTargets : [],
      imp: impLevel,
      manual: manualMode,
    } as APIt.CreateGoalInput;
  };

  const createNewGoalInput = () => {
    let bg: APIt.CreateGoalInput = createNewBaseGoal();
    if (goalType === APIt.GoalType.B || goalType === APIt.GoalType.E) {
      bg.tbi = taxBenefitInt;
      bg.tdli = maxTaxDeductionInt;
      bg.emi = {
        rate: loanIntRate as number,
        dur: loanYears as number,
        per: loanPer as number,
        ry: loanRepaymentSY as number,
      };
    }
    if (goalType === APIt.GoalType.B) {
      bg.sa = sellAfter;
      bg.achg = assetChgRate;
      bg.amper = amCostPer;
      bg.amsy = amStartYear;
      bg.aiper = aiPer;
      bg.aisy = aiStartYear;
      bg.tbr = rentTaxBenefit;
      bg.ra = rentAmt;
      bg.rachg = rentChgPer;
    }
    return bg;
  };

  const createUpdateGoalInput = () => {
    let g: APIt.CreateGoalInput = createNewGoalInput();
    g.id = goal.id;
    return g as APIt.UpdateGoalInput;
  };

  const calculateYearlyCFs = (
    duration: number = getDur(),
    changeState: boolean = true
  ) => {
    let cfs: Array<number> = [];
    if (!price) {
      setCFs([...cfs]);
      return cfs;
    }
    let g: APIt.CreateGoalInput = createNewGoalInput();
    cfs = calculateCFs(price, g, duration);
    console.log("New cfs created: ", cfs);
    if (changeState) {
      if ((loanPer as number) && manualMode < 1 && goalType === APIt.GoalType.B)
        setEndYear(g.sy + cfs.length - 1);
      setCFs([...cfs]);
    }
    return cfs;
  };

  const changeStartYear = (str: string) => {
    setStartYear(parseInt(str));
  };

  useEffect(() => {
    console.log("Inside useEffect...");
    console.log("BR Comparision available", isBRCompAvailable());
    if (isBRCompAvailable()) setShowBRChart(true);
  }, [cfs, cashFlows]);

  useEffect(() => {
    if (!loanPer) setEYOptions(initYearOptions(startYear, 20));
    else setLoanRepaymentSY(startYear);
    if (goalType === APIt.GoalType.B && loanPer) return;
    if (startYear > endYear || endYear - startYear > 20) setEndYear(startYear);
  }, [startYear]);

  const changeEndYear = (str: string) => {
    let ey = parseInt(str);
    setEndYear(ey);
  };

  useEffect(() => {
    if (manualMode) return;
    let p = 0;
    if (startingPrice)
      p = getCompoundedIncome(priceChgRate, startingPrice, startYear - goal.by);
    setPrice(Math.round(p));
  }, [startingPrice, priceChgRate, startYear, manualMode]);

  useEffect(() => {
    if (!manualMode) return;
    let p = 0;
    wipTargets.forEach((t) => (p += t.val));
    setPrice(Math.round(p));
  }, [wipTargets, manualMode]);

  useEffect(() => {
    if (cashFlows || (!allInputDone && (currentOrder < 7 || currentOrder > 19)))
      return;
    if (!cashFlows) calculateYearlyCFs();
  }, [
    price,
    assetChgRate,
    loanPer,
    loanRepaymentSY,
    loanIntRate,
    loanYears,
    startYear,
    sellAfter,
    taxRate,
    maxTaxDeduction,
    taxBenefitInt,
    allInputDone,
    currentOrder,
    maxTaxDeductionInt,
    amCostPer,
    amStartYear,
    aiPer,
    aiStartYear,
    cashFlows,
  ]);

  useEffect(() => {
    if (!allInputDone && showTab === rentLabel) return;
    if (goalType !== APIt.GoalType.B && manualMode < 1) calculateYearlyCFs();
  }, [endYear]);

  useEffect(() => {
    let result = ffImpactYearsHandler(startYear, cfs, goal.id, impLevel);
    setFFImpactYears(result.ffImpactYears);
    setRR([...result.rr]);
    setFFOOM(result.ffOOM);
  }, [cfs, impLevel]);

  useEffect(() => {
    if (!hasTab(loanLabel)) return;
    manualMode > 0
      ? (tabOptions[2].active = false)
      : (tabOptions[2].active = true);
    setTabOptions([...tabOptions]);
  }, [manualMode]);

  const hasTab = (option: string) => {
    let options = tabOptions.filter((tab) => tab.label === option);
    return options && options.length === 1;
  };

  const initBuyCFsForComparison = (analyzeFor: number) => {
    let allCFs: Array<Array<number>> = [];
    for (let i = 1; i <= analyzeFor; i++)
      allCFs.push(calculateYearlyCFs(i, false));
    return allCFs;
  };

  useEffect(() => {
    if (manualMode > 0 && endYear === startYear) setEndYear(startYear + 2);
    else if (manualMode < 1 && loanPer === 0 && goalType === APIt.GoalType.B)
      setEndYear(startYear);
  }, [manualMode, loanPer]);

  const handleSubmit = async () => {
    setBtnClicked(true);
    goal.id
      ? await updateCallback(createUpdateGoalInput(), cfs)
      : await addCallback(createNewGoalInput(), cfs);
    setBtnClicked(false);
  };

  const changeCurrency = (curr: string) => {
    setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
    setCurrency(curr);
  };

  useEffect(() => {
    if (!rentAmt) {
      setRentAns("");
      if (resultTabOptions[1].active) {
        resultTabOptions[1].active = false;
        setResultTabOptions([...resultTabOptions]);
        setShowBRChart(false);
        if (showResultTab === brChartLabel) setShowResultTab(cfChartLabel);
      }
    } else if (isBRCompAvailable()) {
      if (!resultTabOptions[1].active) {
        resultTabOptions[1].active = true;
        setResultTabOptions([...resultTabOptions]);
      }
      setShowBRChart(true);
      if (showResultTab !== brChartLabel) setShowResultTab(brChartLabel);
    }
  }, [rentAmt]);

  useEffect(() => {
    if (showTab === rentLabel && isBRCompAvailable())
      setShowResultTab(brChartLabel);
  }, [showTab]);

  const getTabLabelByOrder = (order: number) => {
    let result = tabOptions.filter((t) => t.order === order && t.active);
    if (result && result.length === 1) return result[0].label;
    return null;
  };

  const handleNextStep = (count: number = 1) => {
    if (!allInputDone) {
      let co = currentOrder + count;
      let label = getTabLabelByOrder(co);
      if (label) setShowTab(label);
      setCurrentOrder(co);
      if (label === rentLabel) setAllInputDone(true);
    }
  };

  const getDur = () =>
    getDuration(
      sellAfter,
      startYear,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentSY,
      loanYears
    );

  const showResultSection = () =>
    nowYear < startYear && allInputDone && cfs.length > 0;

  return (
    <div className="w-full h-full">
      <StickyHeader cancelCallback={cancelCallback} cancelDisabled={btnClicked}>
        <TextInput
          name="name"
          inputOrder={1}
          currentOrder={currentOrder}
          nextStepDisabled={name.length < 3}
          allInputDone={allInputDone}
          nextStepHandler={handleNextStep}
          pre={typesList[goalType]}
          placeholder="Goal Name"
          value={name}
          changeHandler={setName}
          width="150px"
        />
        <SelectInput
          name="imp"
          inputOrder={2}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          nextStepHandler={handleNextStep}
          allInputDone={allInputDone}
          pre="Importance"
          value={impLevel}
          changeHandler={setImpLevel}
          options={getImpLevels()}
        />
      </StickyHeader>
      <div
        className={`container mx-auto w-full h-full flex flex-1 md:flex-row ${
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
          submitDisabled={
            !allInputDone || name.length < 3 || !price || btnClicked
          }
          cancelDisabled={btnClicked}
        >
          {showTab === amtLabel && (
            <Fragment>
              <div className="flex justify-around w-full items-end">
                <SelectInput
                  name="ccy"
                  inputOrder={3}
                  currentOrder={currentOrder}
                  nextStepDisabled={false}
                  allInputDone={allInputDone}
                  nextStepHandler={handleNextStep}
                  pre="Currency"
                  value={currency}
                  changeHandler={changeCurrency}
                  currency
                />
                <SelectInput
                  name="sy"
                  inputOrder={4}
                  currentOrder={currentOrder}
                  nextStepDisabled={false}
                  allInputDone={allInputDone}
                  nextStepHandler={handleNextStep}
                  pre="When?"
                  info="Year in which You Start Paying for the Goal"
                  value={startYear}
                  changeHandler={changeStartYear}
                  options={syOptions}
                  actionCount={
                    goalType === APIt.GoalType.B && manualMode < 1 ? 2 : 1
                  }
                />
                <SelectInput
                  name="ey"
                  pre="Pay Until"
                  value={endYear}
                  inputOrder={5}
                  currentOrder={currentOrder}
                  nextStepDisabled={false}
                  allInputDone={allInputDone}
                  nextStepHandler={handleNextStep}
                  info="Year in which You End Paying for the Goal"
                  disabled={goalType === APIt.GoalType.B && manualMode < 1}
                  changeHandler={changeEndYear}
                  options={eyOptions}
                />
              </div>
              <div className="flex justify-around w-full mt-4">
                <Cost
                  startingCost={startingPrice}
                  startingCostHandler={setStartingPrice}
                  rangeFactor={rangeFactor}
                  manualTargets={wipTargets}
                  manualTargetsHandler={setWIPTargets}
                  currency={currency}
                  cost={price}
                  costChgRate={priceChgRate}
                  costChgRateHandler={setPriceChgRate}
                  endYear={endYear}
                  manualMode={manualMode}
                  manualModeHandler={setManualMode}
                  startYear={startYear}
                  baseYear={goal.by}
                  leftMax={goalType === APIt.GoalType.B ? 1500000 : 50000}
                  leftNote={
                    goalType !== APIt.GoalType.D ? "including taxes & fees" : ""
                  }
                  inputOrder={6}
                  currentOrder={currentOrder}
                  nextStepDisabled={false}
                  nextStepHandler={handleNextStep}
                  allInputDone={allInputDone}
                />
              </div>
            </Fragment>
          )}

          {showTab === taxLabel && (
            <div className="flex justify-around w-full">
              <TaxBenefit
                goalType={goalType}
                taxRate={taxRate}
                taxRateHandler={setTaxRate}
                currency={currency}
                maxTaxDeduction={maxTaxDeduction}
                maxTaxDeductionHandler={setMaxTaxDeduction}
                rangeFactor={rangeFactor}
                inputOrder={8}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                loanDur={loanYears}
                loanPer={loanPer}
                nextStepHandler={handleNextStep}
                allInputDone={allInputDone}
                price={price}
                loanRY={loanRepaymentSY}
                startYear={startYear}
                manualMode={manualMode}
                loanRate={loanIntRate}
                endYear={endYear}
                duration={getDur()}
                priceChgRate={priceChgRate}
              />
            </div>
          )}

          {showTab === loanLabel && (
            <div className="flex w-full justify-around">
              <EmiCost
                price={price}
                currency={currency}
                startYear={startYear}
                duration={getDur()}
                repaymentSY={loanRepaymentSY ? loanRepaymentSY : startYear}
                endYear={endYear}
                rangeFactor={rangeFactor}
                loanYears={loanYears as number}
                loanAnnualInt={loanIntRate as number}
                loanPer={loanPer as number}
                loanBorrowAmt={
                  getLoanBorrowAmt(
                    price,
                    goalType,
                    manualMode,
                    priceChgRate,
                    endYear - startYear,
                    loanPer as number
                  ) as number
                }
                loanAnnualIntHandler={setLoanIntRate}
                loanPerHandler={setLoanPer}
                loanMonthsHandler={setLoanYears}
                repaymentSYHandler={setLoanRepaymentSY}
                taxBenefitInt={taxBenefitInt as number}
                taxBenefitIntHandler={setTaxBenefitInt}
                taxRate={taxRate}
                maxTaxDeductionInt={maxTaxDeductionInt as number}
                maxTaxDeductionIntHandler={setMaxTaxDeductionInt}
                inputOrder={10}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                nextStepHandler={handleNextStep}
                allInputDone={allInputDone}
              />
            </div>
          )}

          {showTab === maintainLabel && (
            <div className="flex w-full justify-around">
              <AnnualAmt
                currency={currency}
                startYear={startYear}
                percentage={amCostPer as number}
                chgRate={assetChgRate as number}
                percentageHandler={setAMCostPer}
                annualSY={amStartYear as number}
                annualSYHandler={setAMStartYear}
                price={price}
                duration={getDur()}
                title="Yearly Fixes, Insurance, etc costs"
                footer="Include taxes & fees"
                inputOrder={15}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                nextStepHandler={handleNextStep}
                allInputDone={allInputDone}
              />
            </div>
          )}

          {showTab === earnLabel && (
            <div className="flex w-full justify-around">
              <AnnualAmt
                currency={currency}
                startYear={startYear}
                percentage={aiPer as number}
                chgRate={assetChgRate as number}
                percentageHandler={setAIPer}
                annualSY={aiStartYear as number}
                annualSYHandler={setAIStartYear}
                price={price}
                duration={getDur()}
                title="Yearly Income through Rent, Dividend, etc"
                footer="Exclude taxes & fees"
                inputOrder={17}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                nextStepHandler={handleNextStep}
                allInputDone={allInputDone}
              />
            </div>
          )}

          {showTab === sellLabel && (
            <div className="flex sm:justify-center w-full">
              <Sell
                price={price}
                startYear={startYear}
                endYear={endYear}
                sellAfter={sellAfter as number}
                sellPrice={sellPrice}
                sellPriceHandler={setSellPrice}
                sellAfterHandler={setSellAfter}
                cfs={cfs}
                currency={currency}
                assetChgRate={assetChgRate as number}
                assetChgRateHandler={setAssetChgRate}
                inputOrder={19}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                nextStepHandler={handleNextStep}
                allInputDone={allInputDone}
              />
            </div>
          )}

          {showTab === rentLabel && nowYear < startYear && (
            <div className="flex w-full justify-around items-start">
              <Section
                title="If You Rent Instead of Buying"
                insideForm
                left={
                  <NumberInput
                    inputOrder={21}
                    currentOrder={currentOrder}
                    nextStepDisabled={false}
                    nextStepHandler={handleNextStep}
                    allInputDone={allInputDone}
                    name="rentAmt"
                    pre="Yearly"
                    post="Rent"
                    value={rentAmt as number}
                    changeHandler={setRentAmt}
                    min={0}
                    max={100000}
                    step={1000}
                    currency={currency}
                    rangeFactor={rangeFactor}
                  />
                }
                right={
                  rentAmt ? (
                    <NumberInput
                      name="rentChg"
                      inputOrder={22}
                      currentOrder={currentOrder}
                      nextStepDisabled={false}
                      nextStepHandler={handleNextStep}
                      allInputDone={allInputDone}
                      pre="Yearly"
                      post="Change"
                      value={rentChgPer as number}
                      changeHandler={setRentChgPer}
                      min={-10}
                      max={10}
                      step={0.5}
                      unit="%"
                    />
                  ) : (
                    !allInputDone && currentOrder === 22 && handleNextStep()
                  )
                }
                bottom={
                  !!rentAmt && (
                    <NumberInput
                      name="af"
                      pre="Analyze for"
                      value={analyzeFor}
                      changeHandler={setAnalyzeFor}
                      currentOrder={-1}
                      inputOrder={0}
                      nextStepDisabled={false}
                      nextStepHandler={() => true}
                      allInputDone
                      min={10}
                      max={50}
                      step={5}
                      unit="Years"
                    />
                  )
                }
                toggle={
                  taxRate ? (
                    <HToggle
                      rightText="Claim Tax Deduction"
                      value={rentTaxBenefit as number}
                      setter={setRentTaxBenefit}
                    />
                  ) : (
                    <div />
                  )
                }
                footer={
                  rentAns && (
                    <div className="flex items-center">
                      <SVGBalance />
                      <label className="ml-2">{rentAns}</label>
                    </div>
                  )
                }
              />
            </div>
          )}
        </InputSection>
        {showResultSection() && (
          <ResultSection
            resultTabOptions={resultTabOptions}
            showResultTab={showResultTab}
            showResultTabHandler={setShowResultTab}
            chartFullScreenHandler={(fs: boolean) => setChartFullScreen(!fs)}
            result={
              nowYear < startYear && (
                <GoalResult
                  rr={rr}
                  startYear={startYear}
                  currency={currency}
                  ffGoalEndYear={ffGoalEndYear}
                  cfs={cfs}
                  ffOOM={ffOOM}
                  ffImpactYears={ffImpactYears}
                  buyGoal={goalType === APIt.GoalType.B}
                  hideResultLabel
                />
              )
            }
          >
            <LineChart
              cfs={cfs}
              startYear={startYear}
              fullScreen={chartFullScreen}
            />
            {isBRCompAvailable() && (
              <BRComparison
                currency={currency}
                taxRate={taxRate}
                sellAfter={sellAfter as number}
                rr={rr}
                allBuyCFs={initBuyCFsForComparison(analyzeFor)}
                startYear={startYear}
                rentTaxBenefit={rentTaxBenefit as number}
                rentTaxBenefitHandler={setRentTaxBenefit}
                rentAmt={rentAmt as number}
                rentAmtHandler={setRentAmt}
                analyzeFor={analyzeFor}
                rentChgPer={rentChgPer as number}
                rentChgPerHandler={setRentChgPer}
                answer={answer}
                rentAns={rentAns}
                answerHandler={setAnswer}
                rentAnsHandler={setRentAns}
                showChart={showBRChart}
                fullScreen={chartFullScreen}
                manualMode={manualMode}
                manualTgts={wipTargets}
              />
            )}
          </ResultSection>
        )}
      </div>
    </div>
  );
}
