import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { initOptions } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import TaxAdjustment from "../calc/TaxAdjustment";
import GoalCost from "../goals/GoalCost";
import LoanDetails from "./LoanDetails";
import Sell from "../goals/sell";
import BRComp from "../goals/BRComp";
import DDLineChart from "../goals/DDLineChart";
import BuyRentChart from "../goals/BuyRentChart";
import { GoalType } from '../../api/goals';
import { isLoanEligible } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import FIMoneyOutflow from '../goals/FIMoneyOutflow';
import FIBenefit from '../goals/FIBenefit';
import { AfterFI } from '../goals/AfterFI';
import Care from '../goals/Care';
import { BeforeFI } from '../goals/BeforeFI';
import AssetAllocationChart from '../goals/AssetAllocationChart';
import { faChartLine, faChartPie, faChartBar, faBalanceScale, faDonate, faMoneyBillWave, faPiggyBank, faHandHoldingUsd, faHandHoldingMedical, faHandshake, faFileInvoiceDollar, faUserCog } from '@fortawesome/free-solid-svg-icons';
import FIUserDetails from '../goals/FIUserDetails';
import LoanSchedule from './LoanSchedule';
import DynamicAAChart from '../goals/DynamicAAChart';
import FISavingsTargetChart from './FISavingsTargetChart';

const CalcContext = createContext({});

export const getCareTabOption = () => {
  return {
      label: "Care",
      active: true,
      svg: faHandHoldingMedical,
      content: <Care />
  }
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
  const isPublicCalc = addCallback && updateCallback ? false : true;
  const [startYear, setStartYear] = useState<number>(goal.sy);
  const [startMonth, setStartMonth] = useState<number>(goal.sm);
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const [ currency, setCurrency ] = useState<string>(defaultCurrency ? defaultCurrency : goal?.ccy ? goal.ccy : 'USD');
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ dr, setDR ] = useState<number | null>(addCallback && updateCallback ? null : 5);
  const [cfs, setCFs] = useState<Array<number>>([]);
  const [ cfsWithoutSM, setCFsWithoutSM ] = useState<Array<number>>([]);
  const [ inputTabIndex, setInputTabIndex ] = useState<number>(0);
	const [ resultTabIndex, setResultTabIndex ] = useState<number>(0);
	const [ showOptionsForm, setOptionsVisibility ] = useState<boolean>(false);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [rr, setRR] = useState<Array<number>>([]);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const [createNewGoalInput, setCreateNewGoalInput] = useState<Function>(() => true)
  const [rating, setRating ] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [stepVideoUrl, setStepVideoUrl] = useState<string>("");
  const [eyOptions, setEYOptions] = useState(goal.type && goal.type === GoalType.FF ? initOptions(1960, nowYear - 15 - 1960) : initOptions(startYear, 30));
	const [ffResult, setFFResult] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Array<any>>([]);
  const [timer, setTimer] = useState<any>(null);
  const [analyzeFor, setAnalyzeFor] = useState<number>(30);

  const getFFGoalTabOptions = () => {
    return [
      { label: "About", active: true, svg: faUserCog, content: <FIUserDetails /> },
      { label: "Before", active: true, svg: faPiggyBank, content: <BeforeFI /> },
      { label: "After", active: true, svg: faMoneyBillWave, content: <AfterFI /> },
      { label: "Benefit", active: true, svg: faHandHoldingUsd, content: <FIBenefit /> },
      getCareTabOption(),
      { label: "Give", active: true, svg: faDonate, content: <FIMoneyOutflow /> },
    ]
  }
  
  const getFFGoalResultTabOptions = () => {
    let options = [{
      label: `${nowYear + 1} Asset Allocation`,
      active: true,
      svg: faChartPie,
      content: <AssetAllocationChart />
    },
    {
      label: `Allocation Plan starting ${nowYear + 2}`,
      active: true,
      svg: faChartBar,
      content: <DynamicAAChart />
    },
    {
      label: "Portfolio Value",
      active: true,
      svg: faChartLine,
      content: <DDLineChart />
    },
    {
      label: "Saving Targets",
      active: true,
      svg: faChartLine,
      content: <FISavingsTargetChart />
    }];  
    return options;
  }
  
  const getGoalResultTabOptions = () => {
    if (goal.type === GoalType.FF) return getFFGoalResultTabOptions();
    let rTabs: Array<any> = [
        {
          label: "Cash Flows",
          active: true,
          svg: faChartLine,
          content: <DDLineChart />
        },
        {
          label: "Loan Schedule",
          active: false,
          svg: faChartBar,
          content: <LoanSchedule />
        }
      ];
      if (goal.type === GoalType.B) {
        rTabs.push({
          label: "Buy v/s Rent",
          active: false,
          svg: faBalanceScale,
          content: <BuyRentChart />
        });
    }
    return rTabs;
  }
  
  const getGoalTabOptions = (type: GoalType) => {
    if (type === GoalType.FF) return getFFGoalTabOptions();
    let options = [
      { label: "Cost", active: true, svg: faMoneyBillWave, content: <GoalCost /> }];
    if (type === GoalType.B) {
      options.push({ label: "Sell", active: true, svg: faHandshake, content: <Sell /> });
    }
    if (isLoanEligible(type)) options.push(
      { label: "Loan", active: true, svg: faHandHoldingUsd, content: <LoanDetails /> }
    );
    options.push({
      label: "Tax",
      active: true,
      svg: faFileInvoiceDollar,
      content: <TaxAdjustment />
    });
    if (type === GoalType.B) {
      options.push({ label: "Rent?", active: true, svg: faBalanceScale, content: <BRComp /> });
    }
    return options;
  }
	const [ inputTabs, setInputTabs ] = useState<Array<any>>(tabOptions ? tabOptions : goal ? getGoalTabOptions(goal.type) : []);
	const [ resultTabs, setResultTabs ] = useState<Array<any>>(resultTabOptions ? resultTabOptions : goal ? getGoalResultTabOptions() : []);

  const changeStartYear = (str: string) => setStartYear(parseInt(str));

  const changeStartMonth = (str: string) => setStartMonth(parseInt(str));

  const changeEndYear = (str: string) => setEndYear(parseInt(str));

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

  const handleStepChange = (count: number = 1) => {
		let co = inputTabIndex + count;
		if (co < 0 || !inputTabs[co]) return;
		if (!inputTabs[co].active) co += count;
		setInputTabIndex(co);
	};

  const hasTab = (tabLabel: string) => {
    let tabs = inputTabs.filter((tab: any) => tab.label === tabLabel);
    return tabs && tabs.length === 1;
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
        setCurrency,
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
        cfsWithoutSM,
        setCFsWithoutSM,
				resultTabIndex,
				setResultTabIndex,
				fsb,
				showOptionsForm,
        setOptionsVisibility,
        isPublicCalc,
        disableSubmit,
        setDisableSubmit,
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
        startMonth,
        changeStartMonth,
        endYear,
        changeEndYear,
        setEndYear,
        eyOptions,
        setEYOptions,
        ffResult,
        setFFResult,
        error,
        setError,
        results,
        setResults,
        handleStepChange,
        hasTab,
        timer,
        setTimer,
        analyzeFor,
        setAnalyzeFor
			}}
    >
      {children}
		</CalcContext.Provider>
	);
}

export { CalcContext, CalcContextProvider };
