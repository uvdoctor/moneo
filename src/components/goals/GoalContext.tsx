import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { CreateGoalInput, GoalType, LMH, LoanType, TargetInput } from "../../api/goals";
import { createNewTarget, getDuration, isLoanEligible, goalImgStorage } from "../goals/goalutils";
import { createAmortizingLoanCFs, createEduLoanMonthlyCFs, getCompoundedIncome, getEmi, getNPV } from "../calc/finance";
import { adjustAccruedInterest, calculateCFs, calculateSellPrice, createLoanCFs, getClosestTargetVal, getEduLoanAnnualDPs, getLoanBorrowAmt } from "./cfutils";
import { CalcContext } from "../calc/CalcContext";
import DefaultOppCostResult from "../calc/DefaultOppCostResult";
import FIImpact from "./FIImpact";
import BuyRentResult from "../calc/BuyRentResult";
import CalcTemplate from "../calc/CalcTemplate";
import BuyReturnResult from "../calc/BuyReturnResult";
import { useRouter } from "next/router";
import { ROUTES } from "../../CONSTANTS";
import LoanIntResult from "../calc/LoanIntResult";
import TaxBenefitResult from "../calc/TaxBenefitResult";
import { PlanContext } from "./PlanContext";
import TotalCostResult from "./TotalCostResult";

const GoalContext = createContext({});

interface GoalContextProviderProps {
  children?: ReactNode;
}

function GoalContextProvider({ children }: GoalContextProviderProps) {
  const { rr, dr, discountRates, calculateFFImpactYear, isPublicCalc, allCFs }: any = useContext(PlanContext);
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
    ffOOM,
    setFFOOM,
    btnClicked,
    startYear,
    startMonth,
    changeStartMonth,
    endYear,
    setEndYear,
    changeEndYear,
    error,
    setError,
    setResults,
    inputTabs,
    setInputTabs,
    timer,
    setTimer,
    analyzeFor,
    ffImpactYears,
    setFFImpactYears,
    wipGoal,
    setWipGoal,
    summary,
    setDiscountRates,
  }: any = useContext(CalcContext);
  const nowYear = new Date().getFullYear();
  const goalType = goal.type as GoalType;
  const [loanRepaymentMonths, setLoanRepaymentMonths] = useState<number | null | undefined>(goal?.loan?.ry);
  const [price, setPrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(goal?.tdr);
  const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(goal?.tdl);
  const [taxBenefitInt, setTaxBenefitInt] = useState<number | null | undefined>(goal?.tbi);
  const [maxTaxDeductionInt, setMaxTaxDeductionInt] = useState<number | null | undefined>(goal?.tdli);
  const [totalPTaxBenefit, setTotalPTaxBenefit] = useState<number>(0);
  const [totalITaxBenefit, setTotalITaxBenefit] = useState<number>(0);
  const [sellAfter, setSellAfter] = useState<number | undefined | null>(goal?.sa);
  const [loanPer, setLoanPer] = useState<number | undefined | null>(goal?.loan?.per);
  const [eduLoanSISchedule, setEduLoanSISchedule] = useState<Array<number>>([]);
  const [eduLoanPSchedule, setEduLoanPSchedule] = useState<Array<number>>([]);
  const [eduLoanPDueSchedule, setEduLoanPDueSchedule] = useState<Array<number>>([]);
  const [eduCostSemester, setEduCostSemester] = useState<number>(goal.tbr);
 	const [ loanType, setLoanType ] = useState<LoanType | undefined | null>(goal?.loan?.type);
  const [loanGracePeriod, setLoanGracePeriod] = useState<number | undefined | null>(goal?.achg);
  const [loanPrepayments, setLoanPrepayments] = useState<Array<TargetInput>>(goal?.loan?.pp ? goal.loan.pp as Array<TargetInput> : []);
  const [loanIRAdjustments, setLoanIRAdjustments] = useState<Array<TargetInput>>(goal?.loan?.ira ? goal.loan.ira as Array<TargetInput> : []);
  const [totalIntAmt, setTotalIntAmt] = useState<number>(0);
  const [ totalInsAmt, setTotalInsAmt ] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState<number>(goal?.cp as number);
  const [impLevel, setImpLevel] = useState<LMH>(goal?.imp);
  const [manualMode, setManualMode] = useState<number>(goal?.manual);
  const [name, setName] = useState<string>(goal.name);
  const [totalCost, setTotalCost] = useState<number>(0);
  const router = useRouter();
	const isLoanMandatory = router.pathname === ROUTES.LOAN || router.pathname === ROUTES.EDUCATION;
  const [loanMonths, setLoanMonths] = useState<number | null | undefined>(
    goal?.loan?.dur
  );
  const [loanIntRate, setLoanIntRate] = useState<number | null | undefined>(
    goal?.loan?.rate
  );
  const [iSchedule, setISchedule] = useState<Array<number>>([]);
  const [pSchedule, setPSchedule] = useState<Array<number>>([]);
  const [insSchedule, setInsSchedule] = useState<Array<number>>([]);
  const [loanBorrowAmt, setLoanBorrowAmt] = useState<number>(0);
  const [loanStartingCFs, setLoanStartingCFs] = useState<Array<number>>([]);
  const [loanPMI, setLoanPMI] = useState<number>(goal.loan?.pmi);
  const [loanPMIEndPer, setLoanPMIEndPer] = useState<number>(goal.loan?.peper);
  const [emi, setEMI] = useState<number>(goal?.loan?.emi as number);
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
  const [ brAns, setBRAns ] = useState<any>('');
  const [wipTargets, setWIPTargets] = useState<Array<TargetInput>>(
    goal?.tgts as Array<TargetInput>
  );
  const [ annualReturnPer, setAnnualReturnPer ] = useState<number | null>(0);
  const [brChartData, setBRChartData] = useState<Array<any>>([]);
  const [duration, setDuration] = useState<number>(
    getDuration(
      sellAfter,
      startYear,
      startMonth,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentMonths,
      loanMonths,
      goalType === GoalType.E,
      loanGracePeriod
    )
  );
  const [ allBuyCFs, setAllBuyCFs ] = useState<Array<Array<number>>>([]);
  const [ goalImgKey, setGoalImgKey ] = useState<string>(goal.img)
  const [ goalImgUrl, setGoalImgUrl ] = useState<string | null | Object>(null)
  
  useEffect(() =>
    setDisableSubmit(name.length < 3 || !price || btnClicked || !allInputDone || !cfs.length),
    [name, price, btnClicked, allInputDone, cfs]);
    
  const updateBaseGoal = () => {
    return {
      name: name,
      type: goalType,
      by: goal.by,
      sy: startYear,
      sm: startMonth,
      ey: endYear,
      tdr: taxRate,
      tdl: maxTaxDeduction,
      ccy: currency,
      cp: startingPrice,
      chg: priceChgRate,
      tgts: manualMode ? wipTargets : [],
      imp: impLevel,
      manual: manualMode,
      img: goalImgKey
    }
  };

  const getLatestState = () => {
    let g: any = updateBaseGoal();
    if (goal.id) g.id = goal.id;
    if (isLoanEligible(goalType)) {
      g.tbi = taxBenefitInt;
      g.tdli = maxTaxDeductionInt;
      g.loan = {
        type: loanType ? loanType : LoanType.A,
        rate: loanIntRate as number,
        dur: loanMonths as number,
        per: loanPer as number,
        ry: loanRepaymentMonths as number,
        pp: loanPrepayments ? loanPrepayments : [],
        ira: loanIRAdjustments ? loanIRAdjustments : [],
        emi: emi ? emi : 0
      };
    }
    if (sellAfter) {
      g.sa = sellAfter;
      g.achg = assetChgRate;
      g.amper = amCostPer;
      g.amsy = amStartYear;
      g.aiper = aiPer;
      g.aisy = aiStartYear;
      g.tbr = rentTaxBenefit;
      g.ra = rentAmt;
      g.rachg = rentChgPer;
    } else if (goalType === GoalType.E) {
      g.achg = loanGracePeriod;
      g.tbr = eduCostSemester;
    }
    return g as CreateGoalInput;
  };

  useEffect(() => {
    setResults([...[
      !isPublicCalc && <FIImpact key="fii" />,
      <DefaultOppCostResult key="docr" />,
      <TotalCostResult key="tcr" />,
      goalType === GoalType.B && <BuyReturnResult key="brr" />,
      goalType === GoalType.B && <BuyRentResult key="buyrentresult" />,
      isLoanEligible(goalType) && <LoanIntResult key="lir" />,
      <TaxBenefitResult key="tbr" />
    ]]);
  }, []);
  
  useEffect(() => {
    if (!sellAfter) return;
    if (!price) setSellPrice(0);
    else setSellPrice(calculateSellPrice(price, assetChgRate as number, sellAfter));
  }, [price, assetChgRate, sellAfter]);

  useEffect(() => {
    wipGoal.sy = startYear;
    setWipGoal(wipGoal);
    if (startYear <= nowYear) setPriceChgRate(0);
    if (goal.type === GoalType.B) {
      setAIStartYear(startYear);
      setAMStartYear(startYear);
      if(loanPer) return;
    }
    if(startYear > endYear || endYear - startYear > 30) {
      setEndYear(manualMode ? startYear + 2 : startYear);
    }
  }, [startYear]);

  useEffect(() => {
    if (manualMode) return;
    let p = startingPrice;
    if (startingPrice && priceChgRate && startYear > nowYear)
      p = getCompoundedIncome(priceChgRate, startingPrice, startYear - goal.by);
    setPrice(Math.round(p));
    if (resultTabs[1] && isLoanEligible(goal.type) && loanPer && !resultTabs[1].active) {
      resultTabs[1].active = true;
      setResultTabs([...resultTabs]);
    }
  }, [startingPrice, priceChgRate, startYear, manualMode, loanPer]);


  useEffect(() => {
    if (manualMode || goal.type !== GoalType.E) return;
    if (!price || !loanPer || !loanMonths) {
      setLoanBorrowAmt(0);
      setLoanStartingCFs([]);
      setEduLoanPSchedule([...[]]);
      setEduLoanPDueSchedule([...[]]);
      setEduLoanSISchedule([...[]]);
      return;
    }
    let result = createEduLoanMonthlyCFs(startYear, endYear, price, priceChgRate, loanPer, loanIntRate as number, loanPrepayments, loanIRAdjustments, loanGracePeriod as number, eduCostSemester ? true : false);
    setLoanBorrowAmt(result.borrowAmt);
    setEduLoanPSchedule([...result.principal]);
    setEduLoanPDueSchedule([...result.principalDue]);
    setLoanStartingCFs([...getEduLoanAnnualDPs(startMonth, result.dp)]);
    setEduLoanSISchedule([...result.interest]);
  }, [manualMode, price, priceChgRate, loanPer, loanIntRate, loanGracePeriod, startYear, endYear, loanPrepayments, loanIRAdjustments, eduCostSemester]);

  useEffect(() => {
    if (manualMode || goal.type === GoalType.E) return;
    if (!price || !loanPer || !loanMonths) {
      setLoanBorrowAmt(0);
      setLoanStartingCFs([]);
      return;
    }
    let loanBorrowAmt = getLoanBorrowAmt(
        price,
        goalType,
        manualMode,
        priceChgRate,
        endYear - startYear,
        loanPer as number
      );
    let loanDP: Array<number> = [Math.round(loanBorrowAmt / (loanPer as number / 100)) - loanBorrowAmt];
    setLoanStartingCFs([...loanDP]);
    loanBorrowAmt = adjustAccruedInterest(
        loanBorrowAmt,
        loanRepaymentMonths as number,
        loanIntRate as number
    );
    setLoanBorrowAmt(loanBorrowAmt);
  }, [price, manualMode, loanPer, loanIntRate, loanRepaymentMonths, startYear, endYear]);

  useEffect(() => {
    let intRate = loanIntRate as number;
    if (goal.type === GoalType.E && eduLoanSISchedule && eduLoanSISchedule.length && loanIRAdjustments && loanIRAdjustments.length) {
      intRate = getClosestTargetVal(loanIRAdjustments, eduLoanSISchedule.length + 1, intRate);
    }
    setEMI(getEmi(loanBorrowAmt, intRate, loanMonths as number))
  }, [loanBorrowAmt, loanIntRate, loanMonths, eduLoanSISchedule, loanIRAdjustments]);

  const disableLoanChart = () => {
    if(resultTabs[1] && resultTabs[1].active) {
      resultTabs[1].active = false;
      setResultTabs([...resultTabs]);
      if (resultTabIndex === 1) setResultTabIndex(0);
    }
  }

  const createNonEduLoanSchedule = () => {
    if (goal.type === GoalType.E) return;
    if (!emi) {
      setPSchedule([...[]]);
      setInsSchedule([...[]]);
      setISchedule([...[]]);
      disableLoanChart();
      return;
    }
    let result = createAmortizingLoanCFs(loanBorrowAmt, loanIntRate as number, emi, loanPrepayments,
      loanIRAdjustments, loanMonths as number, sellAfter ? sellAfter : null, loanPMI as number, loanPMIEndPer as number);
    setPSchedule([...result.principal]);
    setInsSchedule([...result.insurance]);
    setISchedule([...result.interest]);
    if (resultTabs[1] && !resultTabs[1].active) {
      resultTabs[1].active = true;
      setResultTabs([...resultTabs]);
    }
  }

  useEffect(() => createNonEduLoanSchedule(), [emi, loanPrepayments, loanIRAdjustments, sellAfter, loanPMI, loanPMIEndPer]);

  useEffect(() => {
    if (goal.type !== GoalType.E) return;
    if (!emi) {
      setPSchedule([...[]]);
      setInsSchedule([...[]]);
      setISchedule([...[]]);
      disableLoanChart();
      return;
    }
    let result = createAmortizingLoanCFs(
        loanBorrowAmt,
        getClosestTargetVal(loanIRAdjustments, eduLoanSISchedule.length, loanIntRate as number),
        emi,
        loanPrepayments,
        loanIRAdjustments,
        loanMonths as number,
        null,
        0,
        0,
        eduLoanSISchedule.length
    );
    setPSchedule([...eduLoanPSchedule, ...result.principal]);
    setISchedule([...eduLoanSISchedule, ...result.interest]);
    if (resultTabs[1] && !resultTabs[1].active) {
      resultTabs[1].active = true;
      setResultTabs([...resultTabs]);
    }
  }, [emi, eduLoanSISchedule]);

  useEffect(() => {
    if (manualMode < 1) return;
    let p = 0;
    wipTargets.forEach((t) => (p += t.val));
    if (!p) setError('Cost can not be zero');
    else setError('');
    setPrice(Math.round(p));
    if (isLoanEligible(goal.type)) disableLoanChart();
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

  useEffect(
		() => {
      wipGoal.img = goalImgKey;
		},
		[ goalImgKey ]
	);

  const calculateYearlyCFs = (
    duration: number = getDuration(
      sellAfter,
      startYear,
      startMonth,
      endYear,
      manualMode,
      loanPer,
      loanRepaymentMonths,
      loanMonths,
      goalType === GoalType.E,
      loanGracePeriod
    ),
    changeState: boolean = true
  ) => {
    if (!price && changeState) {
      setCFs([...[]]);
      return [];
    }
    let cfs: Array<number> = [];
    let g: CreateGoalInput = summary ? wipGoal : getLatestState();
    let result: any = {};
    if (!summary)
      if (manualMode < 1 && loanPer) {
        if (!iSchedule || !iSchedule.length) {
          setCFs([...[]]);
          return [];
        }
        let interestSchedule = iSchedule;
        let principalSchedule = pSchedule;
        let insuranceSchedule = insSchedule;
        if (sellAfter && !changeState) {
          let loanSchedule = createAmortizingLoanCFs(loanBorrowAmt, loanIntRate as number, emi, loanPrepayments, loanIRAdjustments, loanMonths as number, duration, loanPMI, loanPMIEndPer);
          interestSchedule = loanSchedule.interest;
          principalSchedule = loanSchedule.principal;
          insuranceSchedule = loanSchedule.insurance;
        }
        result = createLoanCFs(price, loanStartingCFs, interestSchedule, principalSchedule, insuranceSchedule, g, duration, changeState);
      } else {
        result = calculateCFs(price, g, duration, changeState);
      }
    cfs = summary ? allCFs[goal.id] : result.cfs;
    if (changeState) {
      setWipGoal(g);
      console.log("New cf result: ", result);
      if ((loanPer as number) && manualMode < 1 && goalType === GoalType.B) {
        let loanYears = Math.round(loanMonths as number / 12);
        if (loanYears < cfs.length) setEndYear(startYear + ((startMonth > 1 || loanRepaymentMonths) ? loanYears : loanYears - 1));
        else setEndYear(startYear + cfs.length - 1);
      }
      setCFs([...cfs]);
      setDuration(duration);
      if (!summary) {
        setTotalITaxBenefit(result.hasOwnProperty("itb") ? result.itb : 0);
        setTotalPTaxBenefit(result.hasOwnProperty("ptb") ? result.ptb : 0);
      }
    }
    return cfs;
  };

  useEffect(() => {
    let totalIntAmt = 0;
    iSchedule.forEach((int: number) => totalIntAmt += int);
		setTotalIntAmt(Math.round(totalIntAmt));
	}, [iSchedule]);

  useEffect(() => {
    let totalInsAmt = 0;
    insSchedule.forEach((ins: number) => totalInsAmt += ins);
    setTotalInsAmt(Math.round(totalInsAmt));
  }, [insSchedule]);

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
    rr
  ]);

  useEffect(() => {
    wipGoal.ey = endYear;
    setWipGoal(wipGoal);
    if (goalType !== GoalType.B && manualMode < 1) calculateYearlyCFs();
  }, [endYear]);

  useEffect(() => {
    if(cfs.length) {
      let tc = cfs.reduce((val: number, total: number) => val + total);
      if(goalType === GoalType.B) tc -= sellPrice;
      setTotalCost(tc);
    } else setTotalCost(0);
    if (isPublicCalc) return;
    wipGoal.imp = impLevel;
    setWipGoal(wipGoal);
    let result = calculateFFImpactYear(startYear, cfs, goal.id, impLevel, goal.ccy);
    setFFImpactYears(result.impactYears);
    if(wipGoal.id) setDiscountRates([...result.rr]);
  }, [cfs, impLevel]);

  useEffect(() => {
    wipGoal.name = name;
    setWipGoal(wipGoal);
  }, [name]);

  useEffect(() => {
    if (manualMode) {
      changeStartMonth(1);
      if (endYear <= startYear) setEndYear(startYear + 2);
    }
    else if (!loanPer && goalType === GoalType.B)
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
        if(manualMode < 1 || !(goal.type === GoalType.B && i === 1)) inputTabs[i].active = true;
      }
    }
    setInputTabs([...inputTabs]);
  }, [error]);

  const getDiscountRate = (index: number) => {
    if (isPublicCalc) return dr;
    let rates = discountRates ? discountRates : rr;
    if (!rates[index]) return rates[rates.length - 1];
    return rates[index];
  };

  const initBRCompNPVs = () => {
    if (summary) return;
    const firstRRIndex = startYear - (nowYear + 1);
    let buyNPVs: Array<number> = [];
    let rentNPVs: Array<number> = [];
    let results: Array<any> = [];
    let rates = isPublicCalc ? dr : discountRates ? discountRates : rr;
    for (let i = 3; i < allBuyCFs.length + 3; i++) {
      let cfs = [];
      let inv = 0;
      let buyCFs = allBuyCFs[i - 3];
      buyNPVs.push(
        getNPV(rates, buyCFs, startYear - (nowYear + 1))
      );
      for (let j = 0; j < i; j++) {
        let value = getCompoundedIncome(rentChgPer as number, rentAmt as number * 12, j);
        let maintenanceCost = value * (amCostPer as number / 100);
        if (rentTaxBenefit) value *= (1 - taxRate / 100);
        value += maintenanceCost;
        let buyCF = buyCFs[j];
        if (j === i - 1 && buyCF > 0) {
          if (loanPer && loanMonths && manualMode < 1 && i * 12 < loanMonths) buyCF = allBuyCFs[i - 2] ? allBuyCFs[i - 2][j] : buyCFs[j - 1];
          else buyCF -= calculateSellPrice(price, assetChgRate as number, i);
        }
        if (buyCF && buyCF < 0) inv -= buyCF;
        inv -= value;
        if (inv > 0) {
          inv *= 1 + (getDiscountRate(firstRRIndex + j) / 100);
          if (j === i - 1) cfs.push(Math.round(inv));
        }
        if(j < i - 1 || inv <= 0) cfs.push(-Math.round(value));
      }
      if (cfs.length) rentNPVs.push(getNPV(rates, cfs, firstRRIndex));
    }
    if (rentNPVs.length) {
      results.push({
        name: "Buy",
        values: buyNPVs,
      });
      results.push({
        name: "Rent",
        values: rentNPVs,
      });
    }
    return results;
  };

  const getAns = (buyNPV: number, rentNPV: number) => buyNPV > rentNPV ? 'Buy' : 'Rent';

  const identifyCrossOvers = (buyValues: Array<number>, rentValues: Array<number>, initialAns: string) => {
    let crossOvers: Array<number> = [];
    let ans = initialAns;
    for (let i = 0; i < rentValues.length; i++) {
      let result = getAns(buyValues[i], rentValues[i]);
      if (ans !== result) {
        crossOvers.push(i + 2);
        ans = result;
      }
    }
    return crossOvers;
  };

  const findAnswer = (data: Array<any>) => {
    let ans = getAns(data[0].values[0], data[1].values[0]);
    let co: Array<number> = identifyCrossOvers(data[0].values, data[1].values, ans);
    if (co.length) {
      const altAns = ans === 'Rent' ? 'Buy' : 'Rent';
      if (co.length === 1)
        ans = `Upto ${co[0]} Years: ${ans}, else ${altAns}.`;
      else if (co.length === 2)
        ans = `If ${co[0] + 1 < co[1] ? `${co[0] + 1} to ` : ''}${co[1]} Years: ${altAns}, else ${ans}.`;
      else if (co.length === 3)
        ans = `Upto ${co[0]}, or ${co[1] + 1} to ${co[2]} Years: ${ans}. ${altAns} otherwise.`
    }
    setBRAns(ans);
	};

  useEffect(() => {
    if (goal.type !== GoalType.B) return;
    let index = resultTabs.length - 1;
    if (brAns && !resultTabs[index].active) {
      resultTabs[index].active = true;
      setResultTabs([...resultTabs]);
    } else if (!brAns && resultTabs[index].active) {
      resultTabs[index].active = false;
      if (resultTabIndex === index) setResultTabIndex(0);
      setResultTabs([...resultTabs]);
    }
  }, [brAns]);

  useEffect(() => {
    wipGoal.ra = rentAmt;
    wipGoal.rachg = rentChgPer;
    wipGoal.tbr = rentTaxBenefit;
    setWipGoal(wipGoal);
    if (!sellAfter || !allBuyCFs.length) return;
    if (!!rentAmt) {
      let data = initBRCompNPVs();
      if (data && data.length === 2 && data[0].values && data[0].values.length === data[1].values.length) {
        setBRChartData([...data]);
        findAnswer(data);
      }
    } else {
      setBRChartData([...[]]);
      setBRAns("");
    }
  }, [discountRates, rentAmt, rentChgPer, rentTaxBenefit, allBuyCFs, dr]);

  const setAllBuyCFsForComparison = () => {
    if (summary) return;
    let allBuyCFs: Array<Array<number>> = [];
    for (let i = 3; i <= analyzeFor; i++) allBuyCFs.push(calculateYearlyCFs(i, false));
    setAllBuyCFs([...allBuyCFs]);
  };

  useEffect(() => {
    if (allInputDone && sellAfter && cfs.length && analyzeFor && rentAmt)
      setAllBuyCFsForComparison();
  }, [analyzeFor, cfs, allInputDone]);

  useEffect(() => {
    if (!brAns && rentAmt) setAllBuyCFsForComparison();
  }, [rentAmt]);

  useEffect(() => {
    goalImgKey ? goalImgStorage.getUrlFromKey(goalImgKey)
      .then((url: any) => setGoalImgUrl(url))
      .catch((error: string) => console.log(`Error occured while getting URL, ${error}`)) 
      : setGoalImgUrl(null);
  }, [goalImgKey])

    return (
      <GoalContext.Provider
        value={{
          loanRepaymentMonths,
          setLoanRepaymentMonths,
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
          eduLoanSISchedule,
          eduLoanPSchedule,
          eduLoanPDueSchedule,
          eduCostSemester,
          setEduCostSemester,
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
          insSchedule,
          setInsSchedule,
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
          brChartData,
          setBRChartData,
          duration,
          setDuration,
          changeEndYear,
          totalIntAmt,
          setTotalIntAmt,
          totalInsAmt,
          setTotalInsAmt,
          isLoanMandatory,
          emi,
          setEMI,
          loanBorrowAmt,
          loanType,
          setLoanType,
          loanPrepayments,
          setLoanPrepayments,
          annualReturnPer,
          setAnnualReturnPer,
          loanIRAdjustments,
          setLoanIRAdjustments,
          loanPMI,
          setLoanPMI,
          loanPMIEndPer,
          setLoanPMIEndPer,
          totalCost,
          goalImgKey,
          setGoalImgKey,
          goalImgUrl,
          setGoalImgUrl
        }}>
        {children ? children : <CalcTemplate />}
      </GoalContext.Provider>
    );
}

export { GoalContext, GoalContextProvider };