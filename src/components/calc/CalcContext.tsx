import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
  Fragment,
} from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import GoalDetails from "../goals/GoalDetails";
import LoanDetails from "./LoanDetails";
import BRComp from "../goals/BRComp";
import BasicLineChart from "../goals/BasicLineChart";
import BuyRentChart from "../goals/BuyRentChart";
import {
  CalcType,
  CreateGoalInput,
  CreateRatingMutation,
  GoalType,
  UpdateGoalInput,
} from "../../api/goals";
import { isLoanEligible, goalImgStorage } from "../goals/goalutils";
import { AfterFI } from "../goals/AfterFI";
import { FIInvest } from "../goals/FIInvest";
import {
  faChartLine,
  faChartArea,
  faChartPie,
  faChartBar,
  faBalanceScale,
  faMoneyBillWave,
  faPiggyBank,
  faHandHoldingUsd,
  faUserCog,
  faCog,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import FIUserDetails from "../goals/FIUserDetails";
import LoanSchedule from "./LoanSchedule";
import DynamicAAChart from "../goals/DynamicAAChart";
import FIMonthlyInvTargetChart from "./FIMonthlyInvTargetChart";
import { AppContext } from "../AppContext";
import * as mutations from "../../graphql/mutations";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import { CALC_NAMES } from "../../CONSTANTS";
import { FeedbackContext } from "../feedback/FeedbackContext";
import { PlanContext } from "../goals/PlanContext";
import FIPortfolioChart from "../goals/FIPortfolioChart";
import { Modal } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import Advanced from "./Advanced";
import FIAdvanced from "../goals/FIAdvanced";

const CalcContext = createContext({});

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
  summary,
}: CalcContextProviderProps) {
  const { defaultCurrency, user, userInfo }: any = useContext(AppContext);
  const {
    rr,
    addGoal,
    updateGoal,
    setGoal,
    isPublicCalc,
    allCFs,
    ffResult,
    oppCostCache,
    setOppCostCache,
  }: any = useContext(PlanContext);
  let { goal, allGoals }: any = useContext(PlanContext);
  if (calculateFor && !goal) goal = calculateFor;
  const { feedbackId }: any = useContext(FeedbackContext);
  const fsb = useFullScreenBrowser();
  const [startYear, setStartYear] = useState<number>(
    goal.type === GoalType.FF && userInfo
      ? new Date(userInfo.dob).getFullYear()
      : isPublicCalc
      ? new Date().getFullYear()
      : goal.sy
  );
  const [startMonth, setStartMonth] = useState<number>(
    isPublicCalc ? new Date().getMonth() + 1 : goal.sm
  );
  const [endYear, setEndYear] = useState<number>(goal.ey);
  const [currency, setCurrency] = useState<string>(
    goal.ccy ? goal.ccy : defaultCurrency
  );
  const [allInputDone, setAllInputDone] = useState<boolean>(
    goal?.id ? true : false
  );
  const [cfs, setCFs] = useState<Array<number>>([]);
  const [inputTabIndex, setInputTabIndex] = useState<number>(0);
  const [resultTabIndex, setResultTabIndex] = useState<number>(0);
  const [showOptionsForm, setOptionsVisibility] = useState<boolean>(false);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Array<any>>([]);
  const [timer, setTimer] = useState<any>(null);
  const [analyzeFor, setAnalyzeFor] = useState<number>(30);
  const [ffImpactYears, setFFImpactYears] = useState<number | null>(null);
  const [oppCost, setOppCost] = useState<number>(0);
  const [wipGoal, setWipGoal] = useState<CreateGoalInput | null>(goal);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const getCalcType = () => {
    switch (goal.name) {
      case CALC_NAMES.BR:
        return CalcType.BR;
      case CALC_NAMES.DR:
        return CalcType.DR;
      case CALC_NAMES.EDU_LOAN:
        return CalcType.EDU_LOAN;
      case CALC_NAMES.FI:
        return CalcType.FI;
      case CALC_NAMES.LOAN:
        return CalcType.LOAN;
      case CALC_NAMES.TC:
        return CalcType.TC;
    }
  };

  const getFFGoalTabOptions = () => {
    let opts: Array<any> = userInfo
      ? []
      : [
          {
            label: "About",
            active: true,
            svg: faUserCog,
            content: <FIUserDetails />,
          },
        ];
    opts.push(
      ...[
        {
          label: "Invest",
          active: true,
          svg: faPiggyBank,
          content: <FIInvest />,
        },
        {
          label: "After FI",
          active: true,
          svg: faMoneyBillWave,
          content: <AfterFI />,
        },
        {
          label: "Advanced",
          active: true,
          svg: faCog,
          content: <FIAdvanced />,
        },
      ]
    );
    return opts;
  };

  const getFFGoalResultTabOptions = () => {
    let options = [
      {
        label: "Milestones",
        active: true,
        svg: faChartLine,
        content: <FIPortfolioChart />,
      },
      {
        label: "Target Allocation",
        active: true,
        svg: faChartPie,
        content: <DynamicAAChart />,
      },
      {
        label: "Investment Targets",
        active: true,
        svg: faChartArea,
        content: <FIMonthlyInvTargetChart />,
      },
    ];
    return options;
  };

  const getGoalResultTabOptions = () => {
    if (goal.type === GoalType.FF) return getFFGoalResultTabOptions();
    let rTabs: Array<any> = [
      {
        label: "Cash Flows",
        active: true,
        svg: faChartLine,
        content: <BasicLineChart />,
      },
    ];
    if (isLoanEligible(goal.type)) {
      rTabs.push({
        label: "Loan Schedule",
        active: false,
        svg: faChartBar,
        content: <LoanSchedule />,
      });
    }
    if (goal.type === GoalType.B) {
      rTabs.push({
        label: "Buy v/s Rent",
        active: false,
        svg: faBalanceScale,
        content: <BuyRentChart />,
      });
    }
    return rTabs;
  };

  const getGoalTabOptions = (type: GoalType) => {
    if (type === GoalType.FF) return getFFGoalTabOptions();
    let options = [
      {
        label: "Goal",
        active: true,
        svg: faBullseye,
        content: <GoalDetails />,
      },
    ];
    if (isLoanEligible(type))
      options.push({
        label: "Loan",
        active: true,
        svg: faHandHoldingUsd,
        content: <LoanDetails />,
      });
    if (type === GoalType.B) {
      options.push({
        label: "Rent?",
        active: true,
        svg: faBalanceScale,
        content: <BRComp />,
      });
    }
    options.push({
      label: "Advanced",
      active: true,
      svg: faCog,
      content: <Advanced />,
    });
    return options;
  };
  const [inputTabs, setInputTabs] = useState<Array<any>>(
    tabOptions ? tabOptions : goal ? getGoalTabOptions(goal.type) : []
  );
  const [resultTabs, setResultTabs] = useState<Array<any>>(
    resultTabOptions ? resultTabOptions : goal ? getGoalResultTabOptions() : []
  );
  const [discountRates, setDiscountRates] = useState<Array<number>>([...rr]);

  const changeStartYear = (str: string) => setStartYear(parseInt(str));

  const changeStartMonth = (str: string) => setStartMonth(parseInt(str));

  const changeEndYear = (str: string) => setEndYear(parseInt(str));

  const hasGoalChanged = () => {
    if (!wipGoal || !wipGoal.id || !cfs?.length) return false;
    let existingCFs: Array<number> = [];
    if (wipGoal.type === GoalType.FF) {
      if (ffResult.ffCfs) existingCFs = Object.values(ffResult.ffCfs);
      else existingCFs = cfs;
    } else existingCFs = allCFs[wipGoal.id];
    if (!existingCFs?.length) return false;
    if (cfs.length !== existingCFs.length) return true;
    if (wipGoal.img !== goal.img) return true;
    if (
      wipGoal.name !== goal.name ||
      wipGoal.imp !== goal.imp ||
      wipGoal.sy !== goal.sy ||
      wipGoal.ey !== goal.ey ||
      wipGoal.ra !== goal.ra ||
      wipGoal.rachg !== goal.rachg ||
      wipGoal.tbr !== goal.tbr
    )
      return true;
    for (let i in cfs) if (cfs[i] !== existingCFs[i]) return true;
    return false;
  };

  const deleteUnusedGoalImg = async (image: string) => {
    try {
      await goalImgStorage.removeGoalImg(image);
    } catch (error) {
      console.log(`An error occured while deleting the goal image: ${error}`);
    }
  };

  const handleViewReset = (shouldTryToDeleteImage: boolean) => {
    setShowConfirmationModal(false);
    if (
      shouldTryToDeleteImage &&
      wipGoal?.img &&
      wipGoal.img !== goal.img &&
      !goalImgStorage.imageShared(allGoals, goal.id, wipGoal.img)
    )
      deleteUnusedGoalImg(wipGoal.img);
    setWipGoal(null);
    setBtnClicked(false);
    setGoal(null);
  };

  const handleSubmit = async (cancelAction?: boolean) => {
    if (isPublicCalc || !wipGoal) return;
    setBtnClicked(true);
    if (cancelAction && hasGoalChanged()) setShowConfirmationModal(true);
    else if (!cancelAction) {
      if (goal?.id) {
        if (
          goal?.img &&
          goal.img !== wipGoal.img &&
          !goalImgStorage.imageShared(allGoals, goal.id, goal.img)
        )
          deleteUnusedGoalImg(goal.img);
        await updateGoal(wipGoal as UpdateGoalInput, cfs);
        if (goal.type !== GoalType.FF) {
          oppCostCache[goal.id] = oppCost;
          setOppCostCache(oppCostCache);
        }
      } else await addGoal(wipGoal, cfs);
      handleViewReset(false);
    } else handleViewReset(false);
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

  const submitRating = async (rating: number) => {
    try {
      const { data } = (await API.graphql({
        query: mutations.createRating,
        variables: {
          input: {
            type: getCalcType(),
            rating: rating,
            feedbackId: feedbackId,
          },
        },
        authMode: !user
          ? GRAPHQL_AUTH_MODE.AWS_IAM
          : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as {
        data: CreateRatingMutation;
      };
      console.log("Rating submitted successfully", data);
    } catch (e) {
      console.log("Error");
    }
  };

  const uploadGoalImage = async (file: any) => {
    goalImgStorage.validateImg(file);
    try {
      const result: any = await goalImgStorage.storeGoalImg(file);
      return goalImgStorage
        .getUrlFromKey(result.key)
        .then((url: Object | String) => {
          return { key: result.key, url: url };
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      //@ts-ignore
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (!rating) return;
    if (rating && rating < 4) setShowFeedbackModal(true);
    else submitRating(rating);
  }, [rating]);

  useEffect(() => {
    if (feedbackId) submitRating(rating);
    setShowFeedbackModal(false);
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
        startYear,
        changeStartYear,
        startMonth,
        changeStartMonth,
        endYear,
        changeEndYear,
        setEndYear,
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
        setDiscountRates,
        uploadGoalImage,
      }}>
      {children}
      {showConfirmationModal && (
        <Modal
          centered
          title={
            <Fragment>
              <WarningOutlined /> Detected Changes
            </Fragment>
          }
          onOk={() => handleSubmit()}
          onCancel={() => handleViewReset(true)}
          okText="Yes"
          cancelText="No"
          destroyOnClose
          visible={showConfirmationModal}>
          <p>Do You Wish to Save them?</p>
        </Modal>
      )}
    </CalcContext.Provider>
  );
}

export { CalcContext, CalcContextProvider };
