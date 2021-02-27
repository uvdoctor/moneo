import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { initOptions } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import TaxAdjustment from "../calc/TaxAdjustment";
import GoalCost from "../goals/GoalCost";
import LoanDetails from "./LoanDetails";
import Sell from "../goals/sell";
import BRComp from "../goals/BRComp";
import BasicLineChart from "../goals/BasicLineChart";
import BuyRentChart from "../goals/BuyRentChart";
import { CalcType, CreateGoalInput, CreateRatingMutation, GoalType, UpdateGoalInput } from '../../api/goals';
import { isLoanEligible } from '../goals/goalutils';
import FIMoneyOutflow from '../goals/FIMoneyOutflow';
import FIBenefit from '../goals/FIBenefit';
import { AfterFI } from '../goals/AfterFI';
import Care from '../goals/Care';
import { BeforeFI } from '../goals/BeforeFI';
import { faChartLine, faChartArea, faChartPie, faChartBar, faBalanceScale, faDonate, faMoneyBillWave, faPiggyBank, faHandHoldingUsd, faHandHoldingMedical, faHandshake, faFileInvoiceDollar, faUserCog } from '@fortawesome/free-solid-svg-icons';
import FIUserDetails from '../goals/FIUserDetails';
import LoanSchedule from './LoanSchedule';
import DynamicAAChart from '../goals/DynamicAAChart';
import FIMonthlyInvTargetChart from './FIMonthlyInvTargetChart';
import { AppContext } from '../AppContext';
import * as mutations from '../../graphql/mutations';
import awsconfig from '../../aws-exports';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import Amplify, { API } from 'aws-amplify';
import { CALC_NAMES } from '../../CONSTANTS';
import { FeedbackContext } from '../feedback/FeedbackContext';
import { PlanContext } from '../goals/PlanContext';
import FIPortfolioChart from '../goals/FIPortfolioChart';

Amplify.configure(awsconfig);

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
  children: ReactNode;
	tabOptions?: any;
  resultTabOptions?: any;
  calculateFor?: CreateGoalInput;
  summary?: boolean;
}

function CalcContextProvider({
  children,
	tabOptions,
  resultTabOptions,
  calculateFor,
  summary
}: CalcContextProviderProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  const { addGoal, updateGoal, cancelGoal, isPublicCalc, allCFs, ffResult, oppCostCache, setOppCostCache }: any = useContext(PlanContext);
  let { goal }: any = useContext(PlanContext);
  if (calculateFor && !goal) goal = calculateFor;
  const { feedbackId }: any = useContext(FeedbackContext);
  const fsb = useFullScreenBrowser();
  const nowYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(goal.sy);
  const [startMonth, setStartMonth] = useState<number>(goal.sm);
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const [ currency, setCurrency ] = useState<string>(goal.ccy ? goal.ccy : defaultCurrency);
	const [ allInputDone, setAllInputDone ] = useState<boolean>(goal?.id ? true : false);
  const [cfs, setCFs] = useState<Array<number>>([]);
  const [ inputTabIndex, setInputTabIndex ] = useState<number>(0);
	const [ resultTabIndex, setResultTabIndex ] = useState<number>(0);
	const [ showOptionsForm, setOptionsVisibility ] = useState<boolean>(false);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const [rating, setRating ] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [stepVideoUrl, setStepVideoUrl] = useState<string>("");
  const [eyOptions, setEYOptions] = useState(goal.type && goal.type === GoalType.FF ? initOptions(1960, nowYear - 15 - 1960) : initOptions(startYear, 30));
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Array<any>>([]);
  const [timer, setTimer] = useState<any>(null);
  const [analyzeFor, setAnalyzeFor] = useState<number>(30);
  const [ratingId, setRatingId] = useState<String | undefined>('');
  const [ffImpactYears, setFFImpactYears] = useState<number | null>(null);
  const [oppCost, setOppCost] = useState<number>(0);
  const [ wipGoal, setWipGoal ] = useState<CreateGoalInput | null>(goal);

 const getCalcType = () => {
  switch(goal.name) {
    case CALC_NAMES.BR: return CalcType.BR;
    case CALC_NAMES.DR: return CalcType.DR;
    case CALC_NAMES.EDU_LOAN: return CalcType.EDU_LOAN;
    case CALC_NAMES.FI: return CalcType.FI;
    case CALC_NAMES.LOAN: return CalcType.LOAN;
    case CALC_NAMES.TC: return CalcType.TC;
  }
 }

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
    let options = [
    {
      label: "Milestones",
      active: true,
      svg: faChartLine,
      content: <FIPortfolioChart />
      },
      {
        label: 'Target Allocation',
        active: true,
        svg: faChartPie,
        content: <DynamicAAChart />
      },
    {
      label: "Monthly Investment Targets",
      active: true,
      svg: faChartArea,
      content: <FIMonthlyInvTargetChart />
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
          content: <BasicLineChart />
        }
    ];
    if (isLoanEligible(goal.type)) {
      rTabs.push(
        {
          label: "Loan Schedule",
          active: false,
          svg: faChartBar,
          content: <LoanSchedule />
        });
    }
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
  const [discountRates, setDiscountRates] = useState<Array<number>>([]);

  const changeStartYear = (str: string) => setStartYear(parseInt(str));

  const changeStartMonth = (str: string) => setStartMonth(parseInt(str));

  const changeEndYear = (str: string) => setEndYear(parseInt(str));

  const hasGoalChanged = () => {
    if (!wipGoal || !wipGoal.id) return false;
    let existingCFs: Array<number> = [];
    if (wipGoal.type === GoalType.FF) existingCFs = ffResult.ffCfs;
    else existingCFs = allCFs[wipGoal.id];
    if (cfs.length !== existingCFs.length) return true;
    existingCFs.forEach((cf, i) => {
      if (cf !== cfs[i]) return true;
    })
    return false;
  };

  const handleSubmit = async (cancelAction: boolean = false) => {
    if (isPublicCalc || !wipGoal) return;
    setBtnClicked(true);
    if (cancelAction) await cancelGoal(wipGoal, cfs, hasGoalChanged());
    else if (goal?.id) {
      await updateGoal(wipGoal as UpdateGoalInput, cfs);
      if (goal.type !== GoalType.FF) {
        oppCostCache[goal.id] = oppCost;
        setOppCostCache(oppCostCache);
      }
    } else await addGoal(wipGoal, cfs);
    setBtnClicked(false);
    setWipGoal(null);
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
  
  const submitRating = async (rating : number) => {
		try {
			const { data }  = (await API.graphql({
				query: mutations.createRating,
				variables: {
					input: {
						type: getCalcType(),
						rating: rating
					}
				},
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
			})) as {
      data: CreateRatingMutation;
    }
    setRatingId(data.createRating?.id);
  }
  catch (e) {
      console.log('Error')
		} 
  };

  const updateRating = async () => {
    try {
			await API.graphql({
				query: mutations.updateRating,
				variables: {
					input: {
            id: ratingId,
            feedbackId: feedbackId
					}
				},
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
      });
      
		} catch (e) {
      console.log('Error while updating rating', e)
		} 
  }
  
  useEffect(() => {
    if (!rating) return;
    submitRating(rating);
    setShowFeedbackModal(rating && rating < 4 ? true : false);
    }, [rating]);
  
  useEffect(() => {
    if(feedbackId) updateRating();
  }, [feedbackId]);
  
	return (
		<CalcContext.Provider
      value={{
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
        cfs,
        setCFs,
				resultTabIndex,
				setResultTabIndex,
				fsb,
				showOptionsForm,
        setOptionsVisibility,
        disableSubmit,
        setDisableSubmit,
        btnClicked,
        setBtnClicked,
        ffOOM,
        setFFOOM,
        handleSubmit,
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
        error,
        setError,
        results,
        setResults,
        handleStepChange,
        hasTab,
        timer,
        setTimer,
        analyzeFor,
        setAnalyzeFor,
        ffImpactYears,
        setFFImpactYears,
        oppCost,
        setOppCost,
        goal,
        wipGoal,
        setWipGoal,
        summary,
        discountRates,
        setDiscountRates
			}}
    >
      {children}
		</CalcContext.Provider>
	);
}

export { CalcContext, CalcContextProvider };
