import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { CreateGoalInput, GoalType, LMH, LoanType, TargetInput } from "../../api/goals";
import { initYearOptions } from "../utils";
import { createNewTarget, getDuration, isLoanEligible } from "../goals/goalutils";
import { createAmortizingLoanCFs, getCompoundedIncome, getEmi, getNPV } from "../calc/finance";
import { adjustAccruedInterest, calculateCFs, calculateSellPrice, createEduLoanDPWithSICFs, createLoanCFs, getLoanBorrowAmt } from "./cfutils";
import { CalcContext } from "../calc/CalcContext";
import OppCost from "../calc/oppcost";
import FFImpact from "./ffimpact";
import BuyRentResult from "../calc/BuyRentResult";
import GoalHeader from "./GoalHeader";
import CalcTemplate from "../calc/CalcTemplate";
import BuyReturnResult from "../calc/BuyReturnResult";
import { useRouter } from "next/router";
import { ROUTES } from "../../CONSTANTS";
import LoanIntResult from "../calc/LoanIntResult";

const GoalContext = createContext({});

interface GoalContextProviderProps {
  children?: ReactNode;
  ffGoalEndYear?: number;
  ffImpactYearsHandler?: Function;
}

function GoalContextProvider({ children, ffGoalEndYear, ffImpactYearsHandler }: GoalContextProviderProps) {
  const {
    goal,
    currency,
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
    rr,
    setRR,
    ffOOM,
    setFFOOM,
    btnClicked,
    setCreateNewGoalInput,
    startYear,
    startMonth,
    endYear,
    setEndYear,
    changeEndYear,
    setEYOptions,
    error,
    setError,
    setResults,
    addCallback,
    inputTabs,
    setInputTabs,
    timer,
    setTimer
  }: any = useContext(CalcContext);
  const nowYear = new Date().getFullYear();
  const goalType = goal.type as GoalType;
  const [loanRepaymentSY, setLoanRepaymentSY] = useState<
    number | null | undefined
  >(goal?.loan?.ry);
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
    goal?.loan?.per
  );
  const [loanSIPayPer, setLoanSIPayPer] = useState<number | undefined | null>(
    goal.btr
  );
  const [loanSICapitalize, setLoanSICapitalize] = useState<
    number | undefined | null
    >(goal.tbr);
 	const [ loanType, setLoanType ] = useState<LoanType | undefined | null>(goal.loan.type);
  const [loanGracePeriod, setLoanGracePeriod] = useState<
    number | undefined | null
    >(goal.achg);
  const [loanPrepayments, setLoanPrepayments] = useState<Array<TargetInput>>(goal?.loan?.pp as Array<TargetInput>);
  const [loanIRAdjustments, setLoanIRAdjustments] = useState<Array<TargetInput>>(goal?.loan?.ira as Array<TargetInput>);
  const [ totalIntAmt, setTotalIntAmt ] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState<number>(
    goal?.cp as number
  );
  const [impLevel, setImpLevel] = useState<LMH>(goal?.imp);
  const [manualMode, setManualMode] = useState<number>(goal?.manual);
  const [name, setName] = useState<string>(goal.name);
  const router = useRouter();
	const isLoanMandatory = router.pathname === ROUTES.LOAN || router.pathname === ROUTES.EDUCATION;
  const isEndYearHidden = isLoanMandatory && goalType === GoalType.O;
  const [loanMonths, setLoanMonths] = useState<number | null | undefined>(
    goal?.loan?.dur
  );
  const [loanIntRate, setLoanIntRate] = useState<number | null | undefined>(
    goal?.loan?.rate
  );
  const [iSchedule, setISchedule] = useState<Array<number>>([]);
  const [pSchedule, setPSchedule] = useState<Array<number>>([]);
  const [loanBorrowAmt, setLoanBorrowAmt] = useState<number>(0);
  const [loanStartingCFs, setLoanStartingCFs] = useState<Array<number>>([]);
  const [emi, setEMI] = useState<number>(goal?.loan?.emi as number);
	const [ simpleInts, setSimpleInts ] = useState<Array<number>>([]);
  const [remSI, setRemSI] = useState<number>(0);
  const [ capSI, setCapSI ] = useState<number>(0);
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
  const [ annualReturnPer, setAnnualReturnPer ] = useState<number | null>(0);
  const [brChartData, setBRChartData] = useState<Array<any>>([]);
  const [duration, setDuration] = useState<number>(
    getDuration(
      sellAfter,
      startYear,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentSY,
      loanMonths,
    )
  );
  const [allBuyCFs, setAllBuyCFs] = useState<Array<Array<number>>>([]);
  const [analyzeFor, setAnalyzeFor] = useState<number>(20);
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
      bg.loan = {
        type: loanType ? loanType : LoanType.A,
        rate: loanIntRate as number,
        dur: loanMonths as number,
        per: loanPer as number,
        ry: loanRepaymentSY as number,
        pp: loanPrepayments ? loanPrepayments : [],
        ira: loanIRAdjustments ? loanIRAdjustments : [],
        emi: emi ? emi : 0
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

  useEffect(() => {
    setCreateNewGoalInput(createNewGoal);
    setResults([...[
      goalType === GoalType.B && <BuyRentResult />,
      goalType === GoalType.B && <BuyReturnResult />,
      isLoanEligible(goal.type) && <LoanIntResult />,
      addCallback && <FFImpact />,
      <OppCost />
    ]]);
  }, []);
  
  useEffect(() => {
    if (!sellAfter) return;
    if (!price) setSellPrice(0);
    else setSellPrice(calculateSellPrice(price, assetChgRate as number, duration));
  }, [price, assetChgRate, sellAfter]);

  useEffect(() => {
    if (startYear <= nowYear) setPriceChgRate(0);
    if (!loanPer) setEYOptions(initYearOptions(startYear, 30));
    else if (goalType !== GoalType.E) setLoanRepaymentSY(startYear);
    if ((goalType !== GoalType.B) && (isEndYearHidden || startYear > endYear || endYear - startYear > 30))
      setEndYear(startYear);
  }, [startYear, loanPer]);

  useEffect(() => {
    if (manualMode) return;
    let p = startingPrice;
    if (startingPrice && priceChgRate && startYear > nowYear)
      p = getCompoundedIncome(priceChgRate, startingPrice, startYear - goal.by);
    setPrice(Math.round(p));
    if (isLoanEligible(goal.type) && loanPer && !resultTabs[1].active) {
      resultTabs[1].active = true;
      setResultTabs([...resultTabs]);
    }
  }, [startingPrice, priceChgRate, startYear, manualMode, loanPer]);

  useEffect(() => {
    if (manualMode) return;
    if (!price || !loanPer || !loanMonths) {
      setLoanBorrowAmt(0);
      setLoanStartingCFs([]);
      setSimpleInts([]);
      setRemSI(0);
      setCapSI(0);
      return;
    }
    let loanBorrowAmt = 0;
    if (goalType !== GoalType.E) {
      loanBorrowAmt = getLoanBorrowAmt(
        price,
        goalType,
        manualMode,
        priceChgRate,
        endYear - startYear,
        loanPer as number
      );
      let loanDP: Array<number> = [];
      loanDP.push(Math.round(loanBorrowAmt / (loanPer as number / 100)) - loanBorrowAmt);
      setLoanStartingCFs([...loanDP]);
    } else {
      let result = createEduLoanDPWithSICFs(
        price,
        priceChgRate,
        loanPer as number,
        startYear,
        endYear,
        loanIntRate as number,
        loanSIPayPer as number,
        loanSICapitalize as number < 1
      );
      setLoanStartingCFs([...result.cfs]);
      loanBorrowAmt = result.borrowAmt;
      setSimpleInts([...result.ints]);
      setRemSI(result.remIntAmt);
      setCapSI(result.capIntAmt);
    }
    loanBorrowAmt = adjustAccruedInterest(
      loanBorrowAmt,
      goalType === GoalType.E ? endYear + 1 : startYear,
      loanRepaymentSY as number,
      loanIntRate as number
    );
    setLoanBorrowAmt(loanBorrowAmt);
  }, [price, manualMode, loanPer, loanIntRate, loanSIPayPer, loanSICapitalize, loanRepaymentSY, startYear, endYear]);

  useEffect(() => setEMI(getEmi(loanBorrowAmt, loanIntRate as number, loanMonths as number))
  , [loanBorrowAmt, loanIntRate, loanMonths]);

  const createLoanSchedule = () => {
    let result = createAmortizingLoanCFs(loanBorrowAmt, loanIntRate as number, emi, loanPrepayments,
      loanIRAdjustments, loanMonths as number, duration);
    setPSchedule([...result.principal]);
    setISchedule([...result.interest]);
  }
  useEffect(() => createLoanSchedule(), [emi, loanPrepayments, loanIRAdjustments]);

  useEffect(() => {
    if (sellAfter && manualMode < 1 && loanPer && loanMonths && sellAfter * 12 < loanMonths) {
      let duration = getDuration(sellAfter, startYear, endYear, manualMode, loanPer, loanRepaymentSY, loanMonths);
      let result = createAmortizingLoanCFs(loanBorrowAmt, loanIntRate as number, emi, loanPrepayments,
        loanIRAdjustments, loanMonths as number, duration);
      setPSchedule([...result.principal]);
      setISchedule([...result.interest]);
    }
  }, [sellAfter]);

  useEffect(() => {
    if (manualMode < 1) return;
    let p = 0;
    wipTargets.forEach((t) => (p += t.val));
    if (!p) setError('Please enter a valid custom payment plan');
    else setError('');
    setPrice(Math.round(p));
    if (isLoanEligible(goal.type) && resultTabs[1].active) {
      resultTabs[1].active = false;
      setResultTabs([...resultTabs]);
      if (resultTabIndex === 1) setResultTabIndex(0);
    }
  }, [wipTargets, manualMode]);

	const initTargets = () => {
		if (!wipTargets || !setWIPTargets || !startYear || !endYear) return;
		let targets: Array<TargetInput> = [];
		for (let year = startYear; year <= endYear; year++) {
			let existingT = null;
			if (wipTargets.length > 0) {
				existingT = wipTargets.filter((target: TargetInput) => target.num === year)[0] as TargetInput;
			}
			let t = createNewTarget(year, existingT ? existingT.val : 0);
			targets.push(t);
		}
		setWIPTargets([ ...targets ]);
	};

	useEffect(
		() => {
			if (manualMode > 0) initTargets();
		},
		[ manualMode, startYear, endYear ]
	);

  const calculateYearlyCFs = (
    duration: number = getDuration(
      sellAfter,
      startYear,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentSY,
      loanMonths
    ),
    changeState: boolean = true
  ) => {
    if (!price) {
      setCFs([...[]]);
      return [];
    }
    let cfs: Array<number> = [];
    let g: CreateGoalInput = createNewGoal();
    let result: any = {};
    if (manualMode < 1 && loanPer) {
      let interestSchedule = iSchedule;
      let principalSchedule = pSchedule;
      if (sellAfter && duration * 12 < (loanMonths as number) && !changeState) {
        let loanSchedule = createAmortizingLoanCFs(loanBorrowAmt, loanIntRate as number, emi, loanPrepayments, loanIRAdjustments, loanMonths as number, duration);
        interestSchedule = loanSchedule.interest;
        principalSchedule = loanSchedule.principal;
      }
      result = createLoanCFs(price, loanStartingCFs, interestSchedule, principalSchedule, simpleInts, remSI, g, duration);
    } else result = calculateCFs(price, g, duration);
    cfs = result.cfs;
    if (changeState) {
      console.log("New cf result: ", result);
      if ((loanPer as number) && manualMode < 1 && goalType === GoalType.B)
        setEndYear(startYear + cfs.length - 1);
      setCFs([...cfs]);
      setDuration(duration);
      setTotalITaxBenefit(result.hasOwnProperty("itb") ? result.itb : 0);
      setTotalPTaxBenefit(result.hasOwnProperty("ptb") ? result.ptb : 0);
    }
    return cfs;
  };

  useEffect(() => {
    let totalIntAmt = remSI + capSI;
    simpleInts.forEach((int: number) => totalIntAmt += int);
    iSchedule.forEach((int: number) => totalIntAmt += int);
		setTotalIntAmt(Math.round(totalIntAmt));
	}, [iSchedule, simpleInts, remSI, capSI]);

  useEffect(() => {
    if (!allInputDone && inputTabIndex < 2) return;
    clearTimeout(timer);
    setTimer(setTimeout(() => calculateYearlyCFs(), 300));
  }, [
    allInputDone,
    price,
    assetChgRate,
    startYear,
    startMonth,
    sellAfter,
    taxRate,
    maxTaxDeduction,
    taxBenefitInt,
    maxTaxDeductionInt,
    amCostPer,
    amStartYear,
    aiPer,
    aiStartYear,
    iSchedule,
    pSchedule
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

  useEffect(() => {
    if (error) {
      for (let i = 1; i < inputTabs.length; i++) {
        inputTabs[i].active = false;
      }
    } else {
      for (let i = 1; i < inputTabs.length; i++) {
        if(manualMode < 1 || !(goal.type === GoalType.B && i === 3)) inputTabs[i].active = true;
      }
    }
    setInputTabs([...inputTabs]);
  }, [error]);

  const getNextTaxAdjRentAmt = (val: number) =>
    val *
    (1 + (rentChgPer as number) / 100) *
    ((rentTaxBenefit as number) > 0 ? 1 - taxRate / 100 : 1);

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

  const buildBuyRentComparisonData = () => {
    let results: Array<any> = [];
    if (allBuyCFs && allBuyCFs.length) {
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
				condition = ` until ${i} ${i === 1 ? 'Year' : 'Years'}, else ${alternative}.`;
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
      let data = buildBuyRentComparisonData();
      if (data && data.length == 2) {
        setBRChartData([...data]);
        findAnswer(data);
      }
    } else {
        setBRChartData([...[]]);
        setBRAns("")
    }
  }, [taxRate, rr, rentAmt, rentChgPer, rentTaxBenefit, allBuyCFs, dr]);

  const setAllBuyCFsForComparison = () => {
    let allBuyCFs: Array<Array<number>> = [];
    for (let i = 1; i <= analyzeFor; i++)
      allBuyCFs.push(calculateYearlyCFs(i, false));
    setAllBuyCFs([...allBuyCFs]);
  };

  useEffect(() => {
    if (allInputDone && sellAfter && cfs.length && analyzeFor && rentAmt)
      setAllBuyCFsForComparison();
  }, [analyzeFor, cfs, allInputDone]);

  useEffect(() => {
    if (!brAns && rentAmt) setAllBuyCFsForComparison();
  }, [rentAmt]);

    return (
      <GoalContext.Provider
        value={{
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
          loanMonths,
          setLoanMonths,
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
          setTotalIntAmt,
          isLoanMandatory,
          emi,
          setEMI,
          simpleInts,
          remSI,
          capSI,
          loanBorrowAmt,
          loanType,
          setLoanType,
          loanPrepayments,
          setLoanPrepayments,
          annualReturnPer,
          setAnnualReturnPer,
          loanIRAdjustments,
          setLoanIRAdjustments,
          isEndYearHidden
        }}>
        {children ? children : <CalcTemplate header={<GoalHeader />} />}
      </GoalContext.Provider>
    );
}

export { GoalContext, GoalContextProvider };