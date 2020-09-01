import React, { useState, useEffect, Fragment } from "react";
import SelectInput from "../form/selectinput";
import TextInput from "../form/textinput";
import * as APIt from "../../api/goals";
import { initYearOptions, getRangeFactor } from "../utils";
import EmiCost from "../calc/emicost";
import TaxBenefit from "../calc/taxbenefit";
import Sell from "./sell";
import StickyHeader from "./stickyheader";
import SVGChart from "../svgchart";
import Amt from "./amt";
import { calculateCFs, getLoanBorrowAmt } from "./cfutils";
import {
  getDuration,
  getGoalTypes,
  getImpLevels,
  getOrderByTabLabel,
  isLoanEligible,
} from "./goalutils";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import AnnualAmt from "./annualamt";
import { getCompoundedIncome } from "../calc/finance";
import SVGScale from "../svgscale";
import ResultSection from "./resultsection";
import GoalResult from "./goalresult";
import LineChart from "./linechart";
import InputSection from "./inputsection";
import RentComparison from "./rentcomparison";
import BRCompChart from "./brcompchart";
import SVGPay from "../svgpay";
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGLoan from "../svgloan";
import SVGSell from "../svgsell";
import SVGCashFlow from "../svgcashflow";
interface GoalProps {
  goal: APIt.CreateGoalInput;
  cashFlows?: Array<number>;
  ffGoalEndYear: number;
  videoUrl: string;
  ffImpactYearsHandler: Function;
  cancelCallback: Function;
  addCallback: Function;
  updateCallback: Function;
  videoHandler: Function;
}

export default function Goal({
  goal,
  cashFlows,
  ffGoalEndYear,
  videoUrl,
  ffImpactYearsHandler,
  cancelCallback,
  addCallback,
  updateCallback,
  videoHandler,
}: GoalProps) {
  const typesList = getGoalTypes();
  const goalType = goal?.type as APIt.GoalType;
  const [startYear, setStartYear] = useState<number>(goal.sy);
  const [endYear, setEndYear] = useState<number>(goal.ey);
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
  const [totalPTaxBenefit, setTotalPTaxBenefit] = useState<number>(0);
  const [totalITaxBenefit, setTotalITaxBenefit] = useState<number>(0);
  const [sellAfter, setSellAfter] = useState<number | undefined | null>(
    goal?.sa
  );
  const [loanPer, setLoanPer] = useState<number | undefined | null>(
    goal?.emi?.per
  );
  const [loanSIPayPer, setLoanSIPayPer] = useState<number | undefined | null>(
    goal.btr
  );
  const [loanSICapitalize, setLoanSICapitalize] = useState<number | undefined | null>(goal.tbr)
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
  const [ffImpactYears, setFFImpactYears] = useState<number | null>(null);
  const [rr, setRR] = useState<Array<number>>([]);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const nowYear = new Date().getFullYear();
  const amtLabel = "Cost";
  const taxLabel = "Tax";
  const sellLabel = "Sell";
  const loanLabel = "Loan";
  const annualNetCostLabel = "Yearly";
  const rentLabel = "Rent?";
  const cfChartLabel = "Cash Flows";
  const brChartLabel = "Buy v/s Rent";
  const [chartFullScreen, setChartFullScreen] = useState<boolean>(false);
  const [brChartData, setBRChartData] = useState<Array<any>>([]);
  const [showBRChart, setShowBRChart] = useState<boolean>(
    sellAfter && rentAmt && rentAmt > 0 ? true : false
  );
  const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 20));
  const [tabOptions, setTabOptions] = useState<Array<any>>(
    goalType === APIt.GoalType.B
      ? [
          { label: amtLabel, order: 3, active: true, svg: SVGPay },
          {
            label: taxLabel,
            order: 8,
            active: true,
            svg: SVGTaxBenefit,
          },
          { label: loanLabel, order: 10, active: true, svg: SVGLoan },
          {
            label: annualNetCostLabel,
            order: 15,
            active: true,
            svg: SVGCashFlow,
          },
          { label: sellLabel, order: 19, active: true, svg: SVGSell },
          { label: rentLabel, order: 21, active: true, svg: SVGScale },
        ]
      : !isLoanEligible(goalType)
      ? [
          { label: amtLabel, order: 3, active: true, svg: SVGPay },
          {
            label: taxLabel,
            order: 8,
            active: true,
            svg: SVGTaxBenefit,
          },
        ]
      : [
          { label: amtLabel, order: 3, active: true, svg: SVGPay },
          {
            label: taxLabel,
            order: 8,
            active: true,
            svg: SVGTaxBenefit,
          },
          { label: loanLabel, order: 10, active: true, svg: SVGLoan },
        ]
  );
  const [showTab, setShowTab] = useState(amtLabel);
  const [showResultTab, setShowResultTab] = useState<string>(cfChartLabel);
  const [resultTabOptions, setResultTabOptions] = useState<Array<any>>(
    sellAfter
      ? [
          {
            label: cfChartLabel,
            order: 1,
            active: true,
            svg: SVGChart,
          },
          {
            label: brChartLabel,
            order: 2,
            active: showBRChart,
            svg: SVGScale,
          },
        ]
      : [
          {
            label: cfChartLabel,
            order: 1,
            active: true,
            svg: SVGChart,
          },
        ]
  );

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
    if (isLoanEligible(goalType)) {
      bg.tbi = taxBenefitInt;
      bg.tdli = maxTaxDeductionInt;
      bg.emi = {
        rate: loanIntRate as number,
        dur: loanYears as number,
        per: loanPer as number,
        ry: loanRepaymentSY as number,
      };
    }
    if (sellAfter) {
      bg.sa = sellAfter;
      bg.achg = assetChgRate;
      bg.amper = amCostPer;
      bg.amsy = amStartYear;
      bg.aiper = aiPer;
      bg.aisy = aiStartYear;
      bg.tbr = rentTaxBenefit;
      bg.ra = rentAmt;
      bg.rachg = rentChgPer;
    } else if (goalType === APIt.GoalType.E) {
      bg.btr = loanSIPayPer;
      bg.tbr = loanSICapitalize
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
    let result: any = calculateCFs(price, g, duration);
    cfs = result.cfs;
    console.log("New cfs created: ", cfs);
    if (changeState) {
      if ((loanPer as number) && manualMode < 1 && goalType === APIt.GoalType.B)
        setEndYear(g.sy + cfs.length - 1);
      setCFs([...cfs]);
      if (result.hasOwnProperty("itb")) setTotalITaxBenefit(result.itb);
      setTotalPTaxBenefit(result.ptb);
    }
    return cfs;
  };

  const changeStartYear = (str: string) => {
    setStartYear(parseInt(str));
  };

  useEffect(() => {
    if (!loanPer) setEYOptions(initYearOptions(startYear, 20));
    else if (goalType !== APIt.GoalType.E) setLoanRepaymentSY(startYear);
    if (goalType === APIt.GoalType.B && loanPer) return;
    if (startYear > endYear || endYear - startYear > 20) setEndYear(startYear);
  }, [startYear]);

  const changeEndYear = (str: string) => {
    let ey = parseInt(str);
    setEndYear(ey);
  };

  useEffect(() => {
    if (manualMode > 0) return;
    let p = 0;
    if (startingPrice)
      p = getCompoundedIncome(priceChgRate, startingPrice, startYear - goal.by);
    setPrice(Math.round(p));
  }, [startingPrice, priceChgRate, startYear, manualMode]);

  useEffect(() => {
    if (manualMode < 1) return;
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
    loanSIPayPer,
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
    if (goalType !== APIt.GoalType.B && manualMode < 1) {
      if (
        goalType === APIt.GoalType.E &&
        loanRepaymentSY &&
        loanRepaymentSY <= endYear
      )
        setLoanRepaymentSY(endYear + 1);
      calculateYearlyCFs();
    }
  }, [endYear]);

  useEffect(() => {
    let result = ffImpactYearsHandler(startYear, cfs, goal.id, impLevel);
    setFFImpactYears(result.ffImpactYears);
    setRR([...result.rr]);
    setFFOOM(result.ffOOM);
  }, [cfs, impLevel]);

  useEffect(() => {
    if (!hasTab(loanLabel)) return;
    if (manualMode > 0) {
      tabOptions[2].active = false;
      if (!allInputDone && currentOrder >= tabOptions[2].order) {
        if (tabOptions[3]) {
          if (currentOrder < tabOptions[3].order)
            setCurrentOrder(tabOptions[3].order);
        } else setCurrentOrder(tabOptions[1].order);
      }
    } else tabOptions[2].active = true;
    setTabOptions([...tabOptions]);
  }, [manualMode]);

  const hasTab = (option: string) => {
    let options = tabOptions.filter((tab) => tab.label === option);
    return options && options.length === 1;
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
    if (!sellAfter) return;
    resultTabOptions[1].active = showBRChart;
    setResultTabOptions([...resultTabOptions]);
  }, [showBRChart]);

  useEffect(() => {
    if (
      sellAfter &&
      !!rentAmt &&
      price > 0 &&
      brChartData &&
      brChartData.length === 2 &&
      nowYear < startYear
    )
      setShowBRChart(true);
    else setShowBRChart(false);
  }, [sellAfter, price, rentAmt, brChartData]);

  useEffect(() => {
    if (!sellAfter) return;
    if (resultTabOptions[1].active) {
      if (showTab === rentLabel) setShowResultTab(brChartLabel);
    } else setShowResultTab(cfChartLabel);
  }, [resultTabOptions]);

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
      if (sellAfter) {
        if (label === rentLabel) setAllInputDone(true);
      } else if (hasTab(loanLabel)) {
        if (label === loanLabel) setAllInputDone(true);
      } else if (label === taxLabel) setAllInputDone(true);
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
    videoUrl || (nowYear < startYear && allInputDone && cfs.length > 0);

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
        className={`container mx-auto w-full h-full flex flex-1 lg:flex-row ${
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
            <Amt
              inputOrder={getOrderByTabLabel(tabOptions, amtLabel)}
              currentOrder={currentOrder}
              allInputDone={allInputDone}
              nextStepHandler={handleNextStep}
              startYear={startYear}
              endYear={endYear}
              startYearHandler={changeStartYear}
              endYearHandler={changeEndYear}
              currency={currency}
              currencyHandler={changeCurrency}
              goalType={goalType}
              goalBY={goal.by}
              ffGoalEndYear={ffGoalEndYear}
              rangeFactor={rangeFactor}
              manualMode={manualMode}
              manualTgts={wipTargets}
              manualModeHandler={setManualMode}
              manualTgtsHandler={setWIPTargets}
              startingPrice={startingPrice}
              price={price}
              startingPriceHandler={setStartingPrice}
              priceChgRate={priceChgRate}
              priceChgRateHandler={setPriceChgRate}
              eyOptions={eyOptions}
              videoUrl={videoUrl}
              videoHandler={videoHandler}
            />
          )}

          {showTab === taxLabel && (
            <TaxBenefit
              goalType={goalType}
              taxRate={taxRate}
              taxRateHandler={setTaxRate}
              currency={currency}
              maxTaxDeduction={maxTaxDeduction}
              maxTaxDeductionHandler={setMaxTaxDeduction}
              duration={getDur()}
              rangeFactor={rangeFactor}
              inputOrder={getOrderByTabLabel(tabOptions, taxLabel)}
              currentOrder={currentOrder}
              nextStepDisabled={false}
              nextStepHandler={handleNextStep}
              allInputDone={allInputDone}
              pTaxBenefit={totalPTaxBenefit}
            />
          )}

          {showTab === loanLabel && (
            <EmiCost
              price={price}
              priceChgRate={priceChgRate}
              currency={currency}
              startYear={startYear}
              duration={getDur()}
              repaymentSY={loanRepaymentSY as number}
              endYear={endYear}
              rangeFactor={rangeFactor}
              loanYears={loanYears as number}
              loanAnnualInt={loanIntRate as number}
              loanPer={loanPer as number}
              goalType={goalType}
              loanSIPayPer={loanSIPayPer}
              loanSICapitalize={loanSICapitalize as number}
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
              loanSIPayPerHandler={setLoanSIPayPer}
              loanSICapitalizeHandler={setLoanSICapitalize}
              loanMonthsHandler={setLoanYears}
              repaymentSYHandler={setLoanRepaymentSY}
              taxBenefitInt={taxBenefitInt as number}
              taxBenefitIntHandler={setTaxBenefitInt}
              taxRate={taxRate}
              maxTaxDeductionInt={maxTaxDeductionInt as number}
              maxTaxDeductionIntHandler={setMaxTaxDeductionInt}
              iTaxBenefit={totalITaxBenefit}
              inputOrder={getOrderByTabLabel(tabOptions, loanLabel)}
              currentOrder={currentOrder}
              nextStepDisabled={false}
              nextStepHandler={handleNextStep}
              allInputDone={allInputDone}
              videoUrl={videoUrl}
              videoHandler={videoHandler}
            />
          )}

          {showTab === annualNetCostLabel && (
            <Fragment>
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
                inputOrder={getOrderByTabLabel(tabOptions, annualNetCostLabel)}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                nextStepHandler={handleNextStep}
                allInputDone={allInputDone}
                colorTo
              />
              {(allInputDone ||
                currentOrder >= getOrderByTabLabel(tabOptions, annualNetCostLabel) + 2) && (
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
                  inputOrder={getOrderByTabLabel(tabOptions, annualNetCostLabel) + 2}
                  currentOrder={currentOrder}
                  nextStepDisabled={false}
                  nextStepHandler={handleNextStep}
                  allInputDone={allInputDone}
                />
              )}
            </Fragment>
          )}

          {showTab === sellLabel && (
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
          )}

          {showTab === rentLabel && nowYear < startYear && (
            <RentComparison
              currency={currency}
              rangeFactor={rangeFactor}
              rentAmt={rentAmt as number}
              rentAmtHandler={setRentAmt}
              rentChgPer={rentChgPer as number}
              rentChgPerHandler={setRentChgPer}
              rentTaxBenefit={rentTaxBenefit as number}
              rentTaxBenefitHandler={setRentTaxBenefit}
              taxRate={taxRate}
              sellAfter={sellAfter as number}
              manualMode={manualMode}
              manualTgts={wipTargets}
              startYear={startYear}
              buyCFsHandler={calculateYearlyCFs}
              rr={rr}
              brChartData={brChartData}
              brChartDataHandler={setBRChartData}
            />
          )}
        </InputSection>
        {showResultSection() && (
          <ResultSection
            resultTabOptions={resultTabOptions}
            showResultTab={showResultTab}
            showResultTabHandler={setShowResultTab}
            chartFullScreenHandler={(fs: boolean) => setChartFullScreen(!fs)}
            videoUrl={videoUrl}
            videoHandler={videoHandler}
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
                />
              )
            }
          >
            <LineChart
              cfs={cfs}
              startYear={startYear}
              fullScreen={chartFullScreen}
            />
            {showBRChart && (
              <BRCompChart data={brChartData} fullScreen={chartFullScreen} />
            )}
          </ResultSection>
        )}
      </div>
    </div>
  );
}
