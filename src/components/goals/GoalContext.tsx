import React, { createContext, useEffect, useState } from "react";
import { CreateGoalInput, GoalType, LMH, TargetInput, UpdateGoalInput } from "../../api/goals";
import { getRangeFactor, initYearOptions } from "../utils";
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGPay from "../svgpay";
import SVGLoan from "../svgloan";
import SVGCashFlow from "../svgcashflow";
import SVGSell from "../svgsell";
import SVGScale from "../svgscale";
import { BENEFIT_LABEL, EXPECT_LABEL, GIVE_LABEL, INVEST_LABEL, SPEND_LABEL, CF_CHART_LABEL, getCareTabOption } from "../goals/ffgoal";
import SVGPiggy from "../svgpiggy";
import { getDuration, getOrderByTabLabel, isLoanEligible } from "../goals/goalutils";
import SVGChart from "../svgchart";
import SVGAAChart from "../goals/svgaachart";
import { AA_FUTURE_CHART_LABEL, AA_NEXT_YEAR_CHART_LABEL } from "../goals/ffgoal";
import SVGBarChart from "../svgbarchart";
import SVGInheritance from "../goals/svginheritance";
import { useFullScreenBrowser } from "react-browser-hooks";
import { getCompoundedIncome, getNPV } from "../calc/finance";
import { calculateCFs } from "./cfutils";
import GoalHeader from "./GoalHeader";
import TaxAdjustment from "../calc/TaxAdjustment";
import Amt from "./amt";
import LoanEmi from "../calc/LoanEmi";
import AnnualAmt from "./annualamt";
import Sell from "./sell";
import RentComparison from "./rentcomparison";
import CalcTemplate from "../calc/CalcTemplate";
import FFImpact from "./ffimpact";
import ItemDisplay from "../calc/ItemDisplay";
import OppCost from "../calc/oppcost";
import DDLineChart from "./DDLineChart";
import BuyRentChart from "./BuyRentChart";
import LoanScheduleChart from "./LoanScheduleChart";

const GoalContext = createContext({});

interface GoalContextProviderProps {
  goal: CreateGoalInput;
  addCallback?: Function;
  updateCallback?: Function;
  cashFlows?: Array<number>;
  ffGoalEndYear?: number;
  ffImpactYearsHandler?: Function;
}

const GOAL_CF_CHART_LABEL = "Cash Flows";
const BR_CHART_LABEL = "Buy v/s Rent & Invest";
const LOAN_CHART_LABEL = "EMI Schedule";
const AMT_LABEL = "Cost";
const TAX_LABEL = "Tax";
const SELL_LABEL = "Sell";
const LOAN_LABEL = "Loan";
const ANNUAL_NET_COST_LABEL = "Yearly";
const RENT_LABEL = "Rent?";

const getFFGoalTabOptions = () => {
  return [
    { label: INVEST_LABEL, active: true, svg: SVGPiggy },
    { label: SPEND_LABEL, active: true, svg: SVGPay },
    { label: BENEFIT_LABEL, active: true, svg: SVGTaxBenefit },
    getCareTabOption(),
    { label: EXPECT_LABEL, active: true, svg: SVGCashFlow },
    { label: GIVE_LABEL, active: true, svg: SVGInheritance },
  ]
}

const getFFGoalResultTabOptions = (isGoal: boolean) => {
  return !isGoal
  ? [
      {
        label: CF_CHART_LABEL,
        active: true,
      svg: SVGChart,
        content: <DDLineChart contextType={GoalContext} />
      },
    ]
  : [
      {
        label: AA_NEXT_YEAR_CHART_LABEL,
        active: true,
        svg: SVGAAChart,
      },
      {
        label: AA_FUTURE_CHART_LABEL,
        active: true,
        svg: SVGBarChart,
      },
      {
        label: CF_CHART_LABEL,
        active: true,
        svg: SVGChart,
      },
    ];
}

const getGoalResultTabOptions = (type: GoalType, isGoal: boolean, showBRChart: boolean = false, showLoanChart: boolean = false) => {
  if (type === GoalType.FF) return getFFGoalResultTabOptions(isGoal);
  else return type === GoalType.B
    ? [
        {
          label: GOAL_CF_CHART_LABEL,
          active: true,
        svg: SVGChart,
          content: <DDLineChart contextType={GoalContext} />
        },
        {
          label: BR_CHART_LABEL,
          active: showBRChart,
          svg: SVGScale,
          content: <BuyRentChart />
        },
        {
          label: LOAN_CHART_LABEL,
          active: showLoanChart,//manualMode < 1 && loanPer,
          svg: SVGLoan,
          content: <LoanScheduleChart />
        },
      ]
    : [
        {
          label: GOAL_CF_CHART_LABEL,
          active: true,
        svg: SVGChart,
          content: <DDLineChart contextType={GoalContext} />
        },
        isLoanEligible(type) && {
          label: LOAN_CHART_LABEL,
          active: showLoanChart,
          svg: SVGLoan,
          content: <LoanScheduleChart />
        },
      ]
  
}

const getGoalTabOptions = (type: GoalType) => {
  if (type === GoalType.FF) return getFFGoalTabOptions();
  return type === GoalType.B
      ? [
          { label: AMT_LABEL, active: true, svg: SVGPay, content: <Amt /> },
          {
            label: TAX_LABEL,
            active: true,
            svg: SVGTaxBenefit,
            content: <TaxAdjustment />
          },
          { label: LOAN_LABEL, active: true, svg: SVGLoan, content: <LoanEmi /> },
          {
            label: ANNUAL_NET_COST_LABEL,
            active: true,
            svg: SVGCashFlow,
            content: [<AnnualAmt />, <AnnualAmt income />]
          },
          { label: SELL_LABEL, active: true, svg: SVGSell, content: <Sell /> },
          { label: RENT_LABEL, active: true, svg: SVGScale, content: <RentComparison /> },
        ]
      : !isLoanEligible(type)
      ? [
          { label: AMT_LABEL, active: true, svg: SVGPay, content: <Amt /> },
          {
            label: TAX_LABEL,
            active: true,
            svg: SVGTaxBenefit,
            content: <TaxAdjustment />
          },
        ]
      : [
          { label: AMT_LABEL, active: true, svg: SVGPay, content: <Amt /> },
          {
            label: TAX_LABEL,
            active: true,
            svg: SVGTaxBenefit,
            content: <TaxAdjustment />
          },
          { label: LOAN_LABEL, active: true, svg: SVGLoan, content: <LoanEmi /> },
        ]
}

function GoalContextProvider({ goal, addCallback, updateCallback, cashFlows, ffGoalEndYear, ffImpactYearsHandler }: GoalContextProviderProps) {
  const fsb = useFullScreenBrowser();
  const nowYear = new Date().getFullYear();
  const [inputTabs, setInputTabs] = useState<Array<any>>(getGoalTabOptions(goal.type))
  const [resultTabs, setResultTabs] = useState<Array<any>>(getGoalResultTabOptions(goal.type, addCallback && updateCallback ? true : false))
  const [currency, setCurrency] = useState<string>(goal.ccy);
  const [rangeFactor, setRangeFactor] = useState<number>(getRangeFactor(currency));
	const [ allInputDone, setAllInputDone ] = useState<boolean>(goal?.id ? true : false);
	const [ inputTabIndex, setInputTabIndex ] = useState<number>(0);
  const [ dr, setDR ] = useState<number | null>(addCallback && updateCallback ? null : 5);
  const [ cfs, setCFs ] = useState<Array<number>>(cashFlows ? cashFlows : []);
  const [ resultTabIndex, setResultTabIndex ] = useState<number>(0);
  const [showOptionsForm, setOptionsVisibility] = useState<boolean>(true);
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
  const [impLevel, setImpLevel] = useState<LMH>(goal?.imp);
  const [manualMode, setManualMode] = useState<number>(goal?.manual);
  const [name, setName] = useState<string>(goal.name);
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
  const [rentAmt, setRentAmt] = useState<number | null | undefined>(goal?.ra);
  const [rentChgPer, setRentChgPer] = useState<number | null | undefined>(
    goal?.rachg
  );
  const [ brAns, setBRAns ] = useState<string>('');
  const [wipTargets, setWIPTargets] = useState<Array<TargetInput>>(
    goal?.tgts as Array<TargetInput>
  );
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [ffImpactYears, setFFImpactYears] = useState<number | null>(null);
  const [rr, setRR] = useState<Array<number>>([]);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const [brChartData, setBRChartData] = useState<Array<any>>([]);
  const [showBRChart, setShowBRChart] = useState<boolean>(
    sellAfter && !!rentAmt ? true : false
  );
  const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 30));
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
  const goalType = goal.type as GoalType;
  const isPublicCalc = addCallback && updateCallback ? false : true;
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  useEffect(() =>
    setDisableSubmit(name.length < 3 || !price || btnClicked),
    [name, price, btnClicked]);
    
  const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / rangeFactor));
		setCurrency(curr);
  };
  
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
    } as CreateGoalInput;
  };

  const createNewGoalInput = () => {
    let bg: CreateGoalInput = createNewBaseGoal();
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
    } else if (goalType === GoalType.E) {
      bg.btr = loanSIPayPer;
      bg.tbr = loanSICapitalize;
      bg.achg = loanGracePeriod;
    }
    return bg;
  };

  const createUpdateGoalInput = () => {
    let g: CreateGoalInput = createNewGoalInput();
    g.id = goal.id;
    return g as UpdateGoalInput;
  };

  useEffect(() => {
    const loanOrderNum = getOrderByTabLabel(resultTabs, LOAN_CHART_LABEL);
    if (manualMode < 1 && loanPer) {
      if (!loanOrderNum) {
        resultTabs[resultTabs.length - 1].active = true;
        setResultTabs([...resultTabs]);
      }
    } else if (loanOrderNum) {
      resultTabs[resultTabs.length - 1].active = false;
      setResultTabs([...resultTabs]);
      setResultTabIndex(resultTabs[0].label)
    }
  }, [manualMode, loanPer]);

  const changeStartYear = (str: string) => {
    setStartYear(parseInt(str));
  };

  useEffect(() => {
    if (!loanPer) setEYOptions(initYearOptions(startYear, 30));
    else if (goalType !== GoalType.E) setLoanRepaymentSY(startYear);
    if (goalType === GoalType.B && loanPer) return;
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
    let g: CreateGoalInput = createNewGoalInput();
    let result: any = calculateCFs(price, g, duration);
    cfs = result.cfs;
    console.log("New cfs created: ", cfs);
    if (changeState) {
      if ((loanPer as number) && manualMode < 1 && goalType === GoalType.B)
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
    maxTaxDeductionInt,
    amCostPer,
    amStartYear,
    aiPer,
    aiStartYear,
    cashFlows,
    allInputDone
  ]);

  useEffect(() => {
    if (goalType !== GoalType.B && manualMode < 1) {
      if (
        goalType === GoalType.E &&
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
    if (manualMode > 0 && endYear === startYear) setEndYear(startYear + 2);
    else if (manualMode < 1 && loanPer === 0 && goalType === GoalType.B)
      setEndYear(startYear);
  }, [manualMode, loanPer]);

  const handleSubmit = async () => {
    setBtnClicked(true);
    if (addCallback && updateCallback) {
      goal.id
        ? await updateCallback(createUpdateGoalInput(), cfs)
        : await addCallback(createNewGoalInput(), cfs);
    } 
    setBtnClicked(false);
  };

  useEffect(() => {
    if (!sellAfter) return;
    resultTabs[1].active = showBRChart;
    setResultTabs([...resultTabs]);
  }, [showBRChart]);

  useEffect(() => {
    if (
      sellAfter &&
      !!rentAmt &&
      price > 0 &&
      allInputDone &&
      brChartData &&
      brChartData.length === 2 &&
      nowYear < startYear
    )
      setShowBRChart(true);
    else setShowBRChart(false);
  }, [sellAfter, price, rentAmt, brChartData, allInputDone]);

  useEffect(() => {
    if (!sellAfter) return;
    if (resultTabs[1].active) {
      if (inputTabIndex === inputTabs.length - 1) setResultTabIndex(1);
    } else setResultTabIndex(0);
  }, [resultTabs]);

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

  const findAnswer = (data: Array<any>) => {
		let answer = '';
		let condition = '';
		let buyValues = data[0].values;
		let rentValues = data[1].values;
		if (buyValues[0] < rentValues[0]) {
			answer += 'Rent';
		} else if (buyValues[0] > rentValues[0]) answer += 'Buy';
		else if (buyValues[0] === rentValues[0]) answer += 'Both cost similar.';
		for (let i = 1; i < buyValues.length; i++) {
			let alternative = '';
			if (buyValues[i] < rentValues[i]) alternative += 'Rent';
			else if (buyValues[i] > rentValues[i]) alternative += 'Buy';
			else if (buyValues[i] === rentValues[i]) alternative += 'Both';
			if (!answer.startsWith(alternative)) {
				condition = ` till ${i} ${i === 1 ? 'Year' : 'Years'}. ${alternative} after that.`;
				break;
			}
		}
		setBRAns(answer + condition);
	};

  useEffect(() => {
    if (!sellAfter) return;
    if (!!rentAmt) {
      let data = buildComparisonData();
      if (data && data.length == 2) {
        setBRChartData([...data]);
        findAnswer(data);
      }
    } else {
        setBRChartData([...[]]);
        setBRAns("")
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
      <GoalContext.Provider
        value={{
          goal,
          currency,
          changeCurrency,
          rangeFactor,
          setRangeFactor,
          allInputDone,
          setAllInputDone,
          showTab: inputTabIndex,
          setShowTab: setInputTabIndex,
          inputTabs,
          setInputTabs,
          resultTabs,
          setResultTabs,
          dr,
          setDR,
          cfs,
          setCFs,
          showResultTab: resultTabIndex,
          setShowResultTab: setResultTabIndex,
          fsb,
          addCallback,
          updateCallback,
          cashFlows,
          showOptionsForm,
          setOptionsVisibility,
          startYear,
          endYear,
          loanRepaymentSY,
          setLoanRepaymentSY,
          price,
          setPrice,
          taxRate,
          setTaxRate,
          maxTaxDeduction,
          setMaxTaxDeduction,
          maxTaxDeductionInt,
          setMaxTaxDeductionInt,
          name,
          setName,
          impLevel,
          setImpLevel,
          manualMode,
          setManualMode,
          loanYears,
          setLoanYears,
          loanIntRate,
          setLoanIntRate,
          loanPer,
          setLoanPer,
          totalPTaxBenefit,
          setTotalPTaxBenefit,
          totalITaxBenefit,
          setTotalITaxBenefit,
          loanSIPayPer,
          setLoanSIPayPer,
          loanSICapitalize,
          setLoanSICapitalize,
          taxBenefitInt,
          setTaxBenefitInt,
          sellAfter,
          setSellAfter,
          startingPrice,
          setStartingPrice,
          loanGracePeriod,
          setLoanGracePeriod,
          iSchedule,
          setISchedule,
          pSchedule,
          setPSchedule,
          priceChgRate,
          setPriceChgRate,
          sellPrice,
          setSellPrice,
          assetChgRate,
          setAssetChgRate,
          amCostPer,
          setAMCostPer,
          aiPer,
          setAIPer,
          amStartYear,
          setAMStartYear,
          aiStartYear,
          setAIStartYear,
          rentTaxBenefit,
          setRentTaxBenefit,
          rentAmt,
          setRentAmt,
          rentChgPer,
          setRentChgPer,
          brAns,
          setBRAns,
          wipTargets,
          setWIPTargets,
          btnClicked,
          setBtnClicked,
          rr,
          setRR,
          ffOOM,
          setFFOOM,
          ffImpactYears,
          setFFImpactYears,
          allBuyCFs,
          setAllBuyCFs,
          analyzeFor,
          setAnalyzeFor,
          brChartData,
          setBRChartData,
          eyOptions,
          setEYOptions,
          showBRChart,
          setShowBRChart,
          duration,
          setDuration,
          changeStartYear,
          changeEndYear,
          handleSubmit,
          ffGoalEndYear,
          isPublicCalc,
          disableSubmit
        }}>
        {!allInputDone && <GoalHeader />}
        <CalcTemplate contextType={GoalContext} results={
          nowYear < startYear ? [
            (dr === null || dr === undefined) ? 
              <FFImpact />
              : <ItemDisplay label="Buy v/s Rent" result={brAns} info={brAns} />,
            <OppCost contextType={GoalContext} />
            ] : []}
        />
      </GoalContext.Provider>
    );
}

export { GoalContext, GoalContextProvider };