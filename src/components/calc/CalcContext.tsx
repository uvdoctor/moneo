import React, { createContext, useState, ReactNode } from 'react';
import { getRangeFactor } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGPay from "../svgpay";
import SVGLoan from "../svgloan";
import SVGCashFlow from "../svgcashflow";
import SVGSell from "../svgsell";
import SVGScale from "../svgscale";
import { BENEFIT_LABEL, EXPECT_LABEL, GIVE_LABEL, INVEST_LABEL, SPEND_LABEL, CF_CHART_LABEL, getCareTabOption } from "../goals/ffgoal";
import SVGPiggy from "../svgpiggy";
import SVGChart from "../svgchart";
import SVGAAChart from "../goals/svgaachart";
import { AA_FUTURE_CHART_LABEL, AA_NEXT_YEAR_CHART_LABEL } from "../goals/ffgoal";
import SVGBarChart from "../svgbarchart";
import SVGInheritance from "../goals/svginheritance";
import TaxAdjustment from "../calc/TaxAdjustment";
import Amt from "../goals/amt";
import LoanEmi from "../calc/LoanEmi";
import AnnualAmt from "../goals/annualamt";
import Sell from "../goals/sell";
import RentComparison from "../goals/rentcomparison";
import DDLineChart from "../goals/DDLineChart";
import BuyRentChart from "../goals/BuyRentChart";
import LoanScheduleChart from "../goals/LoanScheduleChart";
import { GoalType } from '../../api/goals';
import { isLoanEligible } from '../goals/goalutils';

const CalcContext = createContext({});

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
        content: <DDLineChart />
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
          label: "Cash Flows",
          active: true,
        svg: SVGChart,
          content: <DDLineChart />
        },
        {
          label: "Buy v/s Rent",
          active: showBRChart,
          svg: SVGScale,
          content: <BuyRentChart />
        },
        {
          label: "Loan Schedule",
          active: showLoanChart,//manualMode < 1 && loanPer,
          svg: SVGLoan,
          content: <LoanScheduleChart />
        },
      ]
    : [
        {
          label: "Cash Flows",
          active: true,
        svg: SVGChart,
          content: <DDLineChart />
        },
        isLoanEligible(type) && {
          label: "Loan Schedule",
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
          { label: "Cost", active: true, svg: SVGPay, content: <Amt /> },
          {
            label: "Tax",
            active: true,
            svg: SVGTaxBenefit,
            content: <TaxAdjustment />
          },
          { label: "Loan", active: true, svg: SVGLoan, content: <LoanEmi /> },
          {
            label: "Yearly",
            active: true,
            svg: SVGCashFlow,
            content: [<AnnualAmt />, <AnnualAmt income />]
          },
          { label: "Sell", active: true, svg: SVGSell, content: <Sell /> },
          { label: "Rent?", active: true, svg: SVGScale, content: <RentComparison /> },
        ]
      : !isLoanEligible(type)
      ? [
          { label: "Cost", active: true, svg: SVGPay, content: <Amt /> },
          {
            label: "Tax",
            active: true,
            svg: SVGTaxBenefit,
            content: <TaxAdjustment />
          },
        ]
      : [
          { label: "Cost", active: true, svg: SVGPay, content: <Amt /> },
          {
            label: "Tax",
            active: true,
            svg: SVGTaxBenefit,
            content: <TaxAdjustment />
          },
          { label: "Loan", active: true, svg: SVGLoan, content: <LoanEmi /> },
        ]
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
        setCreateNewGoalInput
			}}
    >
      {children}
		</CalcContext.Provider>
	);
}

export { CalcContext, CalcContextProvider };
