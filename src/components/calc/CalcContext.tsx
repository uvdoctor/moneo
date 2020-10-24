import React, { createContext, useState } from "react";
import { GoalType } from "../../api/goals";
import { getRangeFactor } from "../utils";
import { AMT_LABEL, ANNUAL_NET_COST_LABEL, BR_CHART_LABEL, LOAN_CHART_LABEL, LOAN_LABEL, RENT_LABEL, SELL_LABEL, TAX_LABEL } from "../goals/goal";
import SVGTaxBenefit from "../svgtaxbenefit";
import SVGPay from "../svgpay";
import SVGLoan from "../svgloan";
import SVGCashFlow from "../svgcashflow";
import SVGSell from "../svgsell";
import SVGScale from "../svgscale";
import { BENEFIT_LABEL, EXPECT_LABEL, GIVE_LABEL, INVEST_LABEL, SPEND_LABEL, CF_CHART_LABEL, getCareTabOption } from "../goals/ffgoal";
import SVGPiggy from "../svgpiggy";
import { isLoanEligible } from "../goals/goalutils";
import SVGChart from "../svgchart";
import SVGAAChart from "../goals/svgaachart";
import { AA_FUTURE_CHART_LABEL, AA_NEXT_YEAR_CHART_LABEL } from "../goals/ffgoal";
import SVGBarChart from "../svgbarchart";
import SVGInheritance from "../goals/svginheritance";
import { useFullScreenBrowser } from "react-browser-hooks";
import CalcHeader from "./CalcHeader";

const CalcContext = createContext({});

interface CalcContextProviderProps {
  goal: any | null;
  children: any;
  title: string;
  defaultCurrency?: string;
  tabOptions?: Array<any>;
  resultTabOptions?: Array<any>;
  type?: GoalType;
  addCallback?: Function;
  updateCallback?: Function;
  cashFlows?: Array<number>;
}

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
          label: CF_CHART_LABEL,
          active: true,
          svg: SVGChart,
        },
        {
          label: BR_CHART_LABEL,
          active: showBRChart,
          svg: SVGScale,
        },
        {
          label: LOAN_CHART_LABEL,
          active: showLoanChart,//manualMode < 1 && loanPer,
          svg: SVGLoan,
        },
      ]
    : [
        {
          label: CF_CHART_LABEL,
          active: true,
          svg: SVGChart,
        },
        isLoanEligible(type) && {
          label: LOAN_CHART_LABEL,
          active: showLoanChart,
          svg: SVGLoan,
        },
      ]
  
}

const getGoalTabOptions = (type: GoalType) => {
  if (type === GoalType.FF) return getFFGoalTabOptions();
  return type === GoalType.B
      ? [
          { label: AMT_LABEL, active: true, svg: SVGPay },
          {
            label: TAX_LABEL,
            active: true,
            svg: SVGTaxBenefit,
          },
          { label: LOAN_LABEL, active: true, svg: SVGLoan },
          {
            label: ANNUAL_NET_COST_LABEL,
            active: true,
            svg: SVGCashFlow,
          },
          { label: SELL_LABEL, active: true, svg: SVGSell },
          { label: RENT_LABEL, active: true, svg: SVGScale },
        ]
      : !isLoanEligible(type)
      ? [
          { label: AMT_LABEL, active: true, svg: SVGPay },
          {
            label: TAX_LABEL,
            active: true,
            svg: SVGTaxBenefit,
          },
        ]
      : [
          { label: AMT_LABEL, active: true, svg: SVGPay },
          {
            label: TAX_LABEL,
            active: true,
            svg: SVGTaxBenefit,
          },
          { label: LOAN_LABEL, active: true, svg: SVGLoan },
        ]
}

function CalcContextProvider({ goal, children, title, defaultCurrency, tabOptions, resultTabOptions, type, addCallback, updateCallback, cashFlows }: CalcContextProviderProps) {
  const fsb = useFullScreenBrowser();
  const [inputTabs, setInputTabs] = useState<Array<any>>(tabOptions ? tabOptions : type ? getGoalTabOptions(type) : [{}])
  const [resultTabs, setResultTabs] = useState<Array<any>>(resultTabOptions ? resultTabOptions : type ? getGoalResultTabOptions(type, addCallback && updateCallback ? true : false) : [{}])
  const [currency, setCurrency] = useState<string>(goal?.ccy ? goal.ccy : defaultCurrency ? defaultCurrency : "USD");
  const [rangeFactor, setRangeFactor] = useState<number>(getRangeFactor(currency));
	const [ allInputDone, setAllInputDone ] = useState<boolean>(goal?.id ? true : false);
	const [ showTab, setShowTab ] = useState<string>(inputTabs[0].label);
  const [ dr, setDR ] = useState<number | null>(addCallback && updateCallback ? null : 5);
  const [ cfs, setCFs ] = useState<Array<number>>(cashFlows ? cashFlows : []);
  const [ showResultTab, setShowResultTab ] = useState<string>(resultTabs[0].label);
  const [showOptionsForm, setOptionsVisibility] = useState<boolean>(true);

  const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / rangeFactor));
		setCurrency(curr);
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
        showTab,
        setShowTab,
        title,
        inputTabs,
        setInputTabs,
        resultTabs,
        setResultTabs,
        dr,
        setDR,
        cfs,
        setCFs,
        showResultTab,
        setShowResultTab,
        fsb,
        addCallback,
        updateCallback,
        cashFlows,
        showOptionsForm,
        setOptionsVisibility
      }}>
      {!allInputDone && <CalcHeader />}
      <div className={allInputDone ? "calculator-page" : ""}>
        {children}
      </div>
    </CalcContext.Provider>
  );
}

export { CalcContext, CalcContextProvider };