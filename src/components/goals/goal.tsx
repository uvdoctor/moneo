import React, { useState, useEffect } from "react";
import SelectInput from "../form/selectinput";
import TextInput from "../form/textinput";
import * as APIt from "../../api/goals";
import { initYearOptions, getRangeFactor} from "../utils";
import LoanEmi from "../calc/LoanEmi";
import TaxAdjustment from "../calc/TaxAdjustment";
import Sell from "./sell";
import TitleSection from "./TitleSection";
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
import AnnualAmt from "./annualamt";
import { getCompoundedIncome, getNPV } from "../calc/finance";
import SVGScale from "../svgscale";
import Result from "./Result";
import GoalResult from "./goalresult";
import DDLineChart from "./DDLineChart";
import Input from "./Input";
import RentComparison from "./rentcomparison";
import BuyRentChart from "./BuyRentChart";
import SVGPay from "../svgpay";
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGLoan from "../svgloan";
import SVGSell from "../svgsell";
import SVGCashFlow from "../svgcashflow";
import LoanScheduleChart from "./LoanScheduleChart";
import { Space } from "antd";
interface GoalProps {
  goal: APIt.CreateGoalInput;
  cashFlows?: Array<number>;
  ffGoalEndYear: number;
  ffImpactYearsHandler?: Function;
  cancelCallback: Function;
  addCallback?: Function;
  updateCallback?: Function;
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
  const [allInputDone, setAllInputDone] = useState<boolean>(
    goal.id ? true : false
  );
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
  const [loanSICapitalize, setLoanSICapitalize] = useState<
    number | undefined | null
  >(goal.tbr);
  const [loanGracePeriod, setLoanGracePeriod] = useState<
    number | undefined | null
  >(goal.achg);
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
  const [iSchedule, setISchedule] = useState<Array<number>>([])
  const [pSchedule, setPSchedule] = useState<Array<number>>([])
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
  const [currentOrder, setCurrentOrder] = useState<number>(
    addCallback && updateCallback ? 1 : 3
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
  const [dr, setDR] = useState<number | null>(
    addCallback && updateCallback ? null : 6
  );
  const cfChartLabel = "Cash Flows";
  const brChartLabel = "Buy v/s Rent & Invest";
  const loanChartLabel = "EMI Schedule";
  const [brChartData, setBRChartData] = useState<Array<any>>([]);
  const [showBRChart, setShowBRChart] = useState<boolean>(
    sellAfter && rentAmt && rentAmt > 0 ? true : false
  );
  const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 30));
  const [tabOptions, setTabOptions] = useState<Array<any>>(
    goalType === APIt.GoalType.B
      ? [
          { label: amtLabel, active: true, svg: SVGPay },
          {
            label: taxLabel,
            active: true,
            svg: SVGTaxBenefit,
          },
          { label: loanLabel, active: true, svg: SVGLoan },
          {
            label: annualNetCostLabel,
            active: true,
            svg: SVGCashFlow,
          },
          { label: sellLabel, active: true, svg: SVGSell },
          { label: rentLabel, active: true, svg: SVGScale },
        ]
      : !isLoanEligible(goalType)
      ? [
          { label: amtLabel, active: true, svg: SVGPay },
          {
            label: taxLabel,
            active: true,
            svg: SVGTaxBenefit,
          },
        ]
      : [
          { label: amtLabel, active: true, svg: SVGPay },
          {
            label: taxLabel,
            active: true,
            svg: SVGTaxBenefit,
          },
          { label: loanLabel, active: true, svg: SVGLoan },
        ]
  );
  const [duration, setDuration] = useState<number>(
    getDuration(
      sellAfter,
      startYear,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentSY,
      loanYears
    )
  );
  const [allBuyCFs, setAllBuyCFs] = useState<Array<Array<number>>>([]);
  const [analyzeFor, setAnalyzeFor] = useState<number>(20);
  const [showTab, setShowTab] = useState(amtLabel);
  const [showResultTab, setShowResultTab] = useState<string>(cfChartLabel);

  const hasTab = (option: string, options: Array<any> = tabOptions) => {
    let opts = options.filter((tab) => tab.label === option);
    return opts && opts.length === 1;
  };

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
          {
            label: loanChartLabel,
            order: 3,
            active: manualMode < 1 && loanPer,
            svg: SVGLoan,
          },
        ]
      : [
          {
            label: cfChartLabel,
            order: 1,
            active: true,
            svg: SVGChart,
          },
          isLoanEligible(goalType) && {
            label: loanChartLabel,
            order: 2,
            active: manualMode < 1 && loanPer,
            svg: SVGLoan,
          },
        ]
  );

  useEffect(() => {
    const loanOrderNum = getOrderByTabLabel(resultTabOptions, loanChartLabel);
    if (manualMode < 1 && loanPer) {
      if (!loanOrderNum) {
        resultTabOptions[resultTabOptions.length - 1].active = true;
        setResultTabOptions([...resultTabOptions]);
      }
    } else if (loanOrderNum) {
      resultTabOptions[resultTabOptions.length - 1].active = false;
      setResultTabOptions([...resultTabOptions]);
      setShowResultTab(resultTabOptions[0].label)
    }
  }, [manualMode, loanPer]);

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
      bg.tbr = loanSICapitalize;
      bg.achg = loanGracePeriod;
    }
    return bg;
  };

  const createUpdateGoalInput = () => {
    let g: APIt.CreateGoalInput = createNewGoalInput();
    g.id = goal.id;
    return g as APIt.UpdateGoalInput;
  };

  const calculateYearlyCFs = (
    duration: number = getDuration(
      sellAfter,
      startYear,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentSY,
      loanYears
    ),
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
      setDuration(duration);
      if (result.hasOwnProperty("itb")) setTotalITaxBenefit(result.itb);
      setTotalPTaxBenefit(result.ptb);
      if(result.hasOwnProperty("iSchedule")) {
        setISchedule([...result.iSchedule])
        setPSchedule([...result.pSchedule])
      }
    }
    return cfs;
  };

  const changeStartYear = (str: string) => {
    setStartYear(parseInt(str));
  };

  useEffect(() => {
    if (!loanPer) setEYOptions(initYearOptions(startYear, 30));
    else if (goalType !== APIt.GoalType.E) setLoanRepaymentSY(startYear);
    if (goalType === APIt.GoalType.B && loanPer) return;
    if (startYear > endYear || endYear - startYear > 30) setEndYear(startYear);
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
    currentOrder,
    maxTaxDeductionInt,
    amCostPer,
    amStartYear,
    aiPer,
    aiStartYear,
    cashFlows,
    allInputDone
  ]);

  useEffect(() => {
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
    if (!ffImpactYearsHandler) return;
    let result = ffImpactYearsHandler(startYear, cfs, goal.id, impLevel);
    setFFImpactYears(result.ffImpactYears);
    setRR([...result.rr]);
    setFFOOM(result.ffOOM);
  }, [cfs, impLevel]);

  useEffect(() => {
    if (!hasTab(loanLabel)) return;
    if (manualMode > 0) {
      tabOptions[2].active = false;
      if (currentOrder >= tabOptions[2].order) {
        if (tabOptions[3]) {
          if (currentOrder < tabOptions[3].order) {
            setShowTab(tabOptions[3].label);
            setCurrentOrder(tabOptions[3].order);
          }
        } else {
          setCurrentOrder(tabOptions[1].order);
          setShowTab(tabOptions[1].label);
        }
      }
    } else tabOptions[2].active = true;
    setTabOptions([...tabOptions]);
  }, [manualMode, currentOrder]);

  useEffect(() => {
    if (manualMode > 0 && endYear === startYear) setEndYear(startYear + 2);
    else if (manualMode < 1 && loanPer === 0 && goalType === APIt.GoalType.B)
      setEndYear(startYear);
  }, [manualMode, loanPer]);

  const handleSubmit = async () => {
    setBtnClicked(true);
    if (addCallback && updateCallback) {
      goal.id
        ? await updateCallback(createUpdateGoalInput(), cfs)
        : await addCallback(createNewGoalInput(), cfs);
    } else cancelCallback();
    setBtnClicked(false);
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

  const showResultSection = () =>
    allInputDone && nowYear < startYear && cfs.length > 0;

  const getNextTaxAdjRentAmt = (val: number) => {
    return (
      val *
      (1 + (rentChgPer as number) / 100) *
      ((rentTaxBenefit as number) > 0 ? 1 - taxRate / 100 : 1)
    );
  };

  const initAllRentCFs = (buyCFs: Array<number>) => {
    const firstRRIndex = startYear - (nowYear + 1);
    if (!rentAmt) return [];
    let taxAdjustedRentAmt = rentAmt * (1 - taxRate / 100);
    if (!buyCFs || buyCFs.length === 0) return [];
    let npv: Array<number> = [];
    for (let i = 0; i < analyzeFor; i++) {
      let cfs = [];
      let inv = 0;
      for (
        let j = 0, value = taxAdjustedRentAmt;
        j <= i;
        j++, value = getNextTaxAdjRentAmt(value)
      ) {
        if (buyCFs[j]) inv += buyCFs[j];
        inv -= value;
        if (inv > 0) {
          let rate = dr === null ? rr[firstRRIndex + j] : dr;
          rate = rate >= 0 ? rate : 3;
          inv += inv * (rate / 100);
        }
        cfs.push(-value);
      }
      cfs.push(inv);
      if (cfs.length > 0) {
        npv.push(getNPV(dr === null ? rr : dr, cfs, firstRRIndex));
      }
    }
    return npv;
  };

  const buildComparisonData = () => {
    let results: Array<any> = [];
    if (allBuyCFs && allBuyCFs.length > 0) {
      results.push({
        name: "Buy",
        values: initAllBuyCFs(allBuyCFs),
      });
      results.push({
        name: "Rent",
        values: initAllRentCFs(getBuyCFForRentAnalysis()),
      });
    }
    return results;
  };

  const getBuyCFForRentAnalysis = () => {
    let arr: Array<number> = [];
    if (!allBuyCFs || allBuyCFs.length === 0) return arr;
    if (manualMode < 1) arr.push(-allBuyCFs[0][0]);
    else wipTargets.forEach((t) => arr.push(t.val));
    return arr;
  };

  const initAllBuyCFs = (allBuyCFs: Array<Array<number>>) => {
    let npv: Array<number> = [];
    for (let i = 0; i < analyzeFor; i++) {
      let buyCFs = allBuyCFs[i];
      if (buyCFs && buyCFs.length > 0) {
        npv.push(
          getNPV(dr === null ? rr : dr, buyCFs, startYear - (nowYear + 1))
        );
      }
    }
    return npv;
  };

  useEffect(() => {
    if (!sellAfter) return;
    if (!!rentAmt) {
      let data = buildComparisonData();
      if (data && data.length == 2) setBRChartData([...data]);
    } else {
      setBRChartData([...[]]);
    }
  }, [taxRate, rr, rentAmt, rentChgPer, rentTaxBenefit, allBuyCFs, dr]);

  useEffect(() => {
    if (!sellAfter || cfs.length === 0 || !rentAmt) return;
    let allBuyCFs: Array<Array<number>> = [];
    for (let i = 1; i <= analyzeFor; i++)
      allBuyCFs.push(calculateYearlyCFs(i, false));
    setAllBuyCFs([...allBuyCFs]);
  }, [analyzeFor, cfs]);

  return (
    <Space align="center" direction="vertical">
      <TitleSection title={name} cancelCallback={cancelCallback}
      currency={currency} currencyHandler={setCurrency} rangeFactorHandler={setRangeFactor} />
        {addCallback && updateCallback && (
          <Space align="center" size="large">
            <TextInput
              name="name"
              pre={typesList[goalType]}
              placeholder="Goal Name"
              value={name}
              changeHandler={setName}
              width="150px"
            />
            <SelectInput
              pre="Importance"
              value={impLevel}
              changeHandler={setImpLevel}
              options={getImpLevels()}
            />
          </Space>
        )}
      <Space align="center">
        <Input
          tabOptions={tabOptions}
          showTab={showTab}
          showTabHandler={setShowTab}
          cancelCallback={cancelCallback}
          handleSubmit={addCallback && cancelCallback ? handleSubmit : null}
          submitDisabled={
            name.length < 3 || !price || btnClicked
          }
          cancelDisabled={btnClicked}
          allInputDone={allInputDone}
          allInputDoneHandler={setAllInputDone}
        >
          {showTab === amtLabel && (
            <Amt
              startYear={startYear}
              endYear={endYear}
              startYearHandler={changeStartYear}
              endYearHandler={changeEndYear}
              currency={currency}
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
            />
          )}

          {showTab === taxLabel && (
            <TaxAdjustment
              goalType={goalType}
              taxRate={taxRate}
              taxRateHandler={setTaxRate}
              currency={currency}
              maxTaxDeduction={maxTaxDeduction}
              maxTaxDeductionHandler={setMaxTaxDeduction}
              duration={duration}
              rangeFactor={rangeFactor}
              pTaxBenefit={totalPTaxBenefit}
            />
          )}

          {showTab === loanLabel && (
            <LoanEmi
              price={price}
              priceChgRate={priceChgRate}
              currency={currency}
              startYear={startYear}
              duration={duration}
              repaymentSY={loanRepaymentSY as number}
              endYear={endYear}
              rangeFactor={rangeFactor}
              loanYears={loanYears as number}
              loanAnnualInt={loanIntRate as number}
              loanPer={loanPer as number}
              goalType={goalType}
              loanSIPayPer={loanSIPayPer}
              loanSICapitalize={loanSICapitalize as number}
              loanGracePeriod={loanGracePeriod as number}
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
              loanGracePeriodHandler={setLoanGracePeriod}
              loanMonthsHandler={setLoanYears}
              repaymentSYHandler={setLoanRepaymentSY}
              taxBenefitInt={taxBenefitInt as number}
              taxBenefitIntHandler={setTaxBenefitInt}
              taxRate={taxRate}
              maxTaxDeductionInt={maxTaxDeductionInt as number}
              maxTaxDeductionIntHandler={setMaxTaxDeductionInt}
              iTaxBenefit={totalITaxBenefit}
            />
          )}

          {showTab === annualNetCostLabel && (
            <Space align="center" direction="vertical">
              <AnnualAmt
                currency={currency}
                startYear={startYear}
                percentage={amCostPer as number}
                chgRate={assetChgRate as number}
                percentageHandler={setAMCostPer}
                annualSY={amStartYear as number}
                annualSYHandler={setAMStartYear}
                price={price}
                duration={duration}
                title="Yearly Fixes, Insurance, etc costs"
                footer="Include taxes & fees"
                colorTo
              />
                <AnnualAmt
                  currency={currency}
                  startYear={startYear}
                  percentage={aiPer as number}
                  chgRate={assetChgRate as number}
                  percentageHandler={setAIPer}
                  annualSY={aiStartYear as number}
                  annualSYHandler={setAIStartYear}
                  price={price}
                  duration={duration}
                  title="Yearly Income through Rent, Dividend, etc"
                  footer="Exclude taxes & fees"
                />
            </Space>
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
              brChartData={brChartData}
              analyzeFor={analyzeFor}
              analyzeForHandler={setAnalyzeFor}
            />
          )}
        </Input>
        {showResultSection() && (
          <Result
            resultTabOptions={resultTabOptions}
            showResultTab={showResultTab}
            showResultTabHandler={setShowResultTab}
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
                  dr={dr}
                  drHandler={setDR}
                />
              )
            }
          >
            {showResultTab === cfChartLabel &&
              <DDLineChart
                cfs={cfs}
                startYear={startYear}
                currency={currency}
              />}
            {showBRChart && showResultTab === brChartLabel && (
              <BuyRentChart data={brChartData} currency={currency} />
            )}
            {manualMode < 1 && loanPer && loanRepaymentSY && loanYears && showResultTab === loanChartLabel &&  (
              <LoanScheduleChart
                repaymentSY={loanRepaymentSY}
                loanYears={iSchedule.length}
                interestSchedule={iSchedule}
                principalSchedule={pSchedule}
                currency={currency}
              />
            )}
          </Result>
        )}
      </Space>
    </Space>
  );
}
