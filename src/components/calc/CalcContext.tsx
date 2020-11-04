import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { getRangeFactor, initYearOptions } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGPay from "../svgpay";
import SVGLoan from "../svgloan";
import SVGCashFlow from "../svgcashflow";
import SVGSell from "../svgsell";
import SVGScale from "../svgscale";
import SVGPiggy from "../svgpiggy";
import SVGChart from "../svgchart";
import SVGAAChart from "../goals/svgaachart";
import SVGBarChart from "../svgbarchart";
import SVGInheritance from "../goals/svginheritance";
import TaxAdjustment from "../calc/TaxAdjustment";
import Amt from "../goals/amt";
import LoanEmi from "../calc/LoanEmi";
import Sell from "../goals/sell";
import RentComparison from "../goals/rentcomparison";
import DDLineChart from "../goals/DDLineChart";
import BuyRentChart from "../goals/BuyRentChart";
import LoanScheduleChart from "../goals/LoanScheduleChart";
import { GoalType } from '../../api/goals';
import { isLoanEligible } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import Expect from '../goals/Expect';
import Nominees from '../goals/nominees';
import SVGCare from '../goals/svgcare';
import RetIncome from '../goals/retincome';
import { ExpenseAfterFF } from '../goals/expenseafterff';
import Care from '../goals/Care';
import { InvestForFI } from '../goals/InvestForFI';
import AssetAllocationChart from '../goals/AssetAllocationChart';
import AAPlanChart from '../goals/AAPlanChart';

const CalcContext = createContext({});

export const getCareTabOption = () => {
  return {
      label: "Care",
      active: true,
      svg: SVGCare,
      content: <Care />
  }
}

const getFFGoalTabOptions = () => {
  return [
    { label: "Invest", active: true, svg: SVGPiggy, content: <InvestForFI /> },
    { label: "Spend", active: true, svg: SVGPay, content: <ExpenseAfterFF /> },
    { label: "Benefit", active: true, svg: SVGTaxBenefit, content: <RetIncome /> },
    getCareTabOption(),
    { label: "Expect", active: true, svg: SVGCashFlow, content: <Expect /> },
    { label: "Give", active: true, svg: SVGInheritance, content: <Nominees /> },
  ]
}

const getFICFChart = () => {
  return {
    label: "Total Portfolio",
    active: true,
    svg: SVGChart,
    content: <DDLineChart />
  }
};

const getFFGoalResultTabOptions = (isGoal: boolean) => {
  if(!isGoal) return [getFICFChart()];
  let options = [{
    label: "Allocation Plan",
    active: true,
    svg: SVGAAChart,
    content: <AAPlanChart />
  }, {
    label: "Asset Allocation",
    active: true,
    svg: SVGBarChart,
    content: <AssetAllocationChart />
  }, getFICFChart()];  
  return options;
}

const getGoalResultTabOptions = (type: GoalType, isGoal: boolean) => {
  if (type === GoalType.FF) return getFFGoalResultTabOptions(isGoal);
  let rTabs: Array<any> = [
      {
        label: "Cash Flows",
        active: true,
        svg: SVGChart,
        content: <DDLineChart />
      },
      {
        label: "Loan Schedule",
        active: false,
        svg: SVGLoan,
        content: <LoanScheduleChart />
      }
    ];
    if (type === GoalType.B) {
      rTabs.push({
        label: "Buy v/s Rent",
        active: false,
        svg: SVGScale,
        content: <BuyRentChart />
      });
  }
  return rTabs;
}

const getGoalTabOptions = (type: GoalType) => {
  if (type === GoalType.FF) return getFFGoalTabOptions();
  let options = [
    { label: "Cost", active: true, svg: SVGPay, content: <Amt /> }];
  if (type === GoalType.B) {
    options.push({ label: "Sell", active: true, svg: SVGSell, content: <Sell /> });
  }
  options.push({
    label: "Tax",
    active: true,
    svg: SVGTaxBenefit,
    content: <TaxAdjustment />
  });
  if (isLoanEligible(type)) options.push(
    { label: "Loan", active: true, svg: SVGLoan, content: <LoanEmi /> }
  );
  if (type === GoalType.B) {
    options.push({ label: "Rent?", active: true, svg: SVGScale, content: <RentComparison /> });
  }
  return options;
}


interface CalcContextProviderProps {
  goal?: any
  children: ReactNode;
	tabOptions?: any;
	resultTabOptions?: any;
  defaultCurrency?: string;
  addCallback?: Function;
  updateCallback?: Function;
}

function CalcContextProvider({
  goal,
  children,
	tabOptions,
	resultTabOptions,
  defaultCurrency,
  addCallback,
  updateCallback
}: CalcContextProviderProps) {
  const fsb = useFullScreenBrowser();
  const nowYear = new Date().getFullYear();
	const [ inputTabs, setInputTabs ] = useState<Array<any>>(tabOptions ? tabOptions : goal ? getGoalTabOptions(goal.type) : []);
	const [ resultTabs, setResultTabs ] = useState<Array<any>>(resultTabOptions ? resultTabOptions : goal ? getGoalResultTabOptions(goal.type, addCallback && updateCallback ? true : false) : []);
	const [ currency, setCurrency ] = useState<string>(defaultCurrency ? defaultCurrency : goal?.ccy ? goal.ccy : 'USD');
	const [ rangeFactor, setRangeFactor ] = useState<number>(getRangeFactor(currency));
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ inputTabIndex, setInputTabIndex ] = useState<number>(0);
	const [ dr, setDR ] = useState<number | null>(addCallback && updateCallback ? null : 5);
	const [ cfs, setCFs ] = useState<Array<number>>([]);
	const [ resultTabIndex, setResultTabIndex ] = useState<number>(0);
	const [ showOptionsForm, setOptionsVisibility ] = useState<boolean>(true);
  const isPublicCalc = addCallback && updateCallback ? false : true;
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
	const [ cfsWithOppCost, setCFsWithOppCost ] = useState<Array<number>>([]);
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [rr, setRR] = useState<Array<number>>([]);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const [createNewGoalInput, setCreateNewGoalInput] = useState<Function>(() => true)
  const [rating, setRating ] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [stepVideoUrl, setStepVideoUrl] = useState<string>("");
  const [startYear, setStartYear] = useState<number>(goal.sy);
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const [eyOptions, setEYOptions] = useState(goal.type && goal.type === GoalType.FF ? initYearOptions(1960, nowYear - 15 - 1960) : initYearOptions(startYear, 30));
	const [ffResult, setFFResult] = useState<any>({});
  const [error, setError] = useState<string>("");

  const changeStartYear = (str: string) => {
    setStartYear(parseInt(str));
  };

  const changeEndYear = (str: string) => {
    let ey = parseInt(str);
    setEndYear(ey);
  };

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / rangeFactor));
		setCurrency(curr);
	};

  const handleSubmit = async () => {
    setBtnClicked(true);
    if (addCallback && updateCallback) {
      let g = createNewGoalInput();
      if (goal?.id) {
        g.id = goal.id
        await updateCallback(g, cfs);
      } else await addCallback(g, cfs);
    } 
    setBtnClicked(false);
  };

  useEffect(() => {
    if (!rating) return;
    gtag.event({
			category: goal.name,
			action: 'Rating',
			label: 'Score',
			value: rating
    });
    setShowFeedbackModal(rating && rating < 4 ? true : false);
    }, [rating]);
  
	return (
		<CalcContext.Provider
      value={{
        goal,
				currency,
				changeCurrency,
				rangeFactor,
				setRangeFactor,
				allInputDone,
				setAllInputDone,
				inputTabIndex,
				setInputTabIndex,
				inputTabs,
				setInputTabs,
				resultTabs,
				setResultTabs,
				dr,
				setDR,
        cfs,
        setCFs,
				resultTabIndex,
				setResultTabIndex,
				fsb,
				showOptionsForm,
        setOptionsVisibility,
        isPublicCalc,
        disableSubmit,
        setDisableSubmit,
        cfsWithOppCost,
        setCFsWithOppCost,
        btnClicked,
        setBtnClicked,
        rr,
        setRR,
        ffOOM,
        setFFOOM,
        handleSubmit,
        createNewGoalInput,
        setCreateNewGoalInput,
        addCallback,
        updateCallback,
        rating,
        setRating,
        showFeedbackModal,
        setShowFeedbackModal,
        feedbackText,
        setFeedbackText,
        stepVideoUrl,
        setStepVideoUrl,
        startYear,
        changeStartYear,
        endYear,
        changeEndYear,
        setEndYear,
        eyOptions,
        setEYOptions,
        ffResult,
        setFFResult,
        error,
        setError
			}}
    >
      {children}
		</CalcContext.Provider>
	);
}

export { CalcContext, CalcContextProvider };
