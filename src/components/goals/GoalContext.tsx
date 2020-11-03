import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { CreateGoalInput, GoalType, LMH, TargetInput } from "../../api/goals";
import { initYearOptions } from "../utils";
import { getDuration, isLoanEligible } from "../goals/goalutils";
import { getCompoundedIncome, getNPV } from "../calc/finance";
import { calculateCFs } from "./cfutils";
import { CalcContext } from "../calc/CalcContext";

const GoalContext = createContext({});

interface GoalContextProviderProps {
  children: ReactNode;
  cashFlows?: Array<number>;
  ffGoalEndYear?: number;
  ffImpactYearsHandler?: Function;
}

function GoalContextProvider({ children, cashFlows, ffGoalEndYear, ffImpactYearsHandler }: GoalContextProviderProps) {
  const {
    goal,
    currency,
    rangeFactor,
    resultTabs,
    setResultTabs,
    allInputDone,
    inputTabIndex,
    resultTabIndex,
    setResultTabIndex,
    setDisableSubmit,
    cfs,
    setCFs,
    dr,
    setDR,
    rr,
    setRR,
    ffOOM,
    setFFOOM,
    btnClicked,
    setBtnClicked,
    setCreateNewGoalInput,
    startYear,
    endYear,
    setEndYear,
    changeEndYear,
    setEYOptions,
    error,
    setError
  }: any = useContext(CalcContext);
  const nowYear = new Date().getFullYear();
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
  const [ totalIntAmt, setTotalIntAmt ] = useState<number>(0);
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
  const [brChartData, setBRChartData] = useState<Array<any>>([]);
  const [duration, setDuration] = useState<number>(
    getDuration(
      sellAfter,
      startYear,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentSY,
      loanYears,
    )
  );
  const [allBuyCFs, setAllBuyCFs] = useState<Array<Array<number>>>([]);
  const [analyzeFor, setAnalyzeFor] = useState<number>(20);
  const goalType = goal.type as GoalType;
  const [ffImpactYears, setFFImpactYears] = useState<number | null>(null);

  useEffect(() =>
    setDisableSubmit(name.length < 3 || !price || btnClicked),
    [name, price, btnClicked]);
    
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

  const createNewGoal = () => {
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

  useEffect(() => setCreateNewGoalInput(createNewGoal), []);
  
  useEffect(() => {
    if (iSchedule && iSchedule.length > 0 && !resultTabs[1].active) {
        resultTabs[1].active = true;
        setResultTabs([...resultTabs]);
    } else if ((!iSchedule || iSchedule.length === 0) && resultTabs[1].active) {
      resultTabs[1].active = false;
      setResultTabs([...resultTabs]);
      if(resultTabIndex === 1) setResultTabIndex(0);
    }
  }, [iSchedule]);

  useEffect(() => {
    if (!loanPer) setEYOptions(initYearOptions(startYear, 30));
    else if (goalType !== GoalType.E) setLoanRepaymentSY(startYear);
    if (goalType === GoalType.B && loanPer) return;
    if (startYear > endYear || endYear - startYear > 30) setEndYear(startYear);
  }, [startYear]);

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
    if (!p) setError('Please enter a valid custom payment plan');
    else setError('');
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
    let g: CreateGoalInput = createNewGoal();
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
    if (!allInputDone && inputTabIndex === 0) return;
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
    allInputDone,
    inputTabIndex
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
    else if (manualMode < 1 && !loanPer && goalType === GoalType.B)
      setEndYear(startYear);
    if (manualMode < 1 && error) setError("");
  }, [manualMode, loanPer]);

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
    if (goal.type !== GoalType.B) return;
    let index = resultTabs.length - 1;
    if (brAns && !resultTabs[index].active) {
      resultTabs[index].active = true;
      setResultTabs([...resultTabs]);
    } else if (!brAns && resultTabs[index].active) {
      resultTabs[index].active = false;
      setResultTabs([...resultTabs]);
      if (resultTabIndex === index) setResultTabIndex(0);
    }
  }, [brAns]);

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
          rangeFactor,
          cfs,
          dr,
          setDR,
          cashFlows,
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
          duration,
          setDuration,
          changeEndYear,
          ffGoalEndYear,
          totalIntAmt,
          setTotalIntAmt
        }}>
        {children}
      </GoalContext.Provider>
    );
}

export { GoalContext, GoalContextProvider };