import { notification } from "antd";
import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import {
  CreateGoalInput,
  GoalType,
  LMH,
  UpdateGoalInput,
} from "../../api/goals";
import { ROUTES } from "../../CONSTANTS";
import { appendValue, getFXRate, removeFromArray } from "../utils";
import { calculateCFs, findEarliestFFYear, isFFPossible } from "./cfutils";
import {
  changeGoal,
  createNewGoal,
  deleteGoal,
  getDuration,
  getGoalsList,
} from "./goalutils";
import { useRouter } from "next/router";
import { AppContext } from "../AppContext";

const PlanContext = createContext({});

interface PlanContextProviderProps {
  goal: CreateGoalInput | null;
  setGoal: Function;
  children: ReactNode;
}

function PlanContextProvider({
  children,
  goal,
  setGoal,
}: PlanContextProviderProps) {
  const { ratesData, appContextLoaded, discountRate, defaultCurrency }: any =
    useContext(AppContext);
  const router = useRouter();
  const isPublicCalc = router.pathname === ROUTES.SET ? false : true;
  const [allGoals, setAllGoals] = useState<Array<CreateGoalInput> | null>([]);
  const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false);
  const [ffGoal, setFFGoal] = useState<CreateGoalInput | null>(
    isPublicCalc && goal && goal.type === GoalType.FF ? goal : null
  );
  const [allCFs, setAllCFs] = useState<any>({});
  const [oppCostCache, setOppCostCache] = useState<any>({});
  const [mustCFs, setMustCFs] = useState<Array<number>>([]);
  const [tryCFs, setTryCFs] = useState<Array<number>>([]);
  const [optCFs, setOptCFs] = useState<Array<number>>([]);
  const [mergedCFs, setMergedCFs] = useState<any>({});
  const [ffResult, setFFResult] = useState<any>({});
  const [ffYear, setFFYear] = useState<number | null>(null);
  const [rr, setRR] = useState<Array<number>>([]);
  const [dr, setDR] = useState<number | null>(
    !isPublicCalc ? null : discountRate ? discountRate : 5
  );
  const [planError, setPlanError] = useState<string>("");
  const nowYear = new Date().getFullYear();

  const getCurrencyFactor = (currency: string) =>
    getFXRate(ratesData, defaultCurrency) / getFXRate(ratesData, currency);

  const loadAllGoals = async () => {
    let goals: Array<CreateGoalInput> | null = await getGoalsList();
    if (!goals || goals.length === 0) {
      setGoalsLoaded(true);
      return;
    }
    let allCFs: any = {};
    let ffGoalId = "";
    goals?.forEach((g) => {
      if (g.type === GoalType.FF) {
        setFFGoal(g);
        ffGoalId = g.id as string;
      } else {
        let result: any = calculateCFs(
          null,
          g,
          getDuration(
            g.sa as number,
            g.sy,
            g.sm as number,
            g.ey,
            g.manual,
            g.loan?.per as number,
            g.loan?.ry as number,
            g.loan?.dur as number,
            g.type === GoalType.E && (g?.loan?.per as number) > 0,
            g.achg as number
          )
        );
        allCFs[g.id as string] = result.cfs;
      }
    });
    removeFromArray(goals, "id", ffGoalId);
    setAllCFs(allCFs);
    setAllGoals([
      ...goals?.sort(
        (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
      ),
    ]);
  };

  const buildEmptyMergedCFs = (fromYear: number, toYear: number) => {
    if (!ffGoal) return {};
    let mCFs: any = {};
    let ffToYear = ffGoal.sy + (ffGoal.loan?.dur as number);
    if (toYear < ffToYear) toYear = ffToYear;
    for (let year = fromYear; year <= toYear; year++) mCFs[year] = 0;
    return mCFs;
  };

  const calculateFFYear = (
    mergedCFs: any,
    mustCFs: Array<number>,
    tryCFs: Array<number>
  ) => {
    if (!ffGoal) return;
    let result = findEarliestFFYear(ffGoal, mergedCFs, ffYear, mustCFs, tryCFs);
    console.log("FF result: ", result);
    setFFResult(result);
    setOppCostCache({});
    setRR([...result.rr]);
    setFFYear(isFFPossible(result, ffGoal.sa as number) ? result.ffYear : null);
  };

  useEffect(() => {
    if (isPublicCalc) {
      setAllGoals([...[]]);
    } else loadAllGoals().then(() => {});
  }, [appContextLoaded]);

  useEffect(() => {
    if (!ffGoal) return;
    let yearRange = getYearRange();
    let mustCFs = populateWithZeros(yearRange.from, yearRange.to);
    let tryCFs = populateWithZeros(yearRange.from, yearRange.to);
    let optCFs = populateWithZeros(yearRange.from, yearRange.to);
    let mCFs = buildEmptyMergedCFs(
      yearRange.from,
      ffGoal.sy + (ffGoal.loan?.dur as number)
    );
    if (isPublicCalc) {
      setMustCFs([...mustCFs]);
      setOptCFs([...optCFs]);
      setTryCFs([...tryCFs]);
      setMergedCFs(mCFs);
      return;
    }
    allGoals?.forEach((g) => {
      let cfs: Array<number> = allCFs[g.id as string];
      if (!cfs) return;
      if (g.imp === LMH.H)
        populateData(mustCFs, cfs, g.sy, yearRange.from, g.ccy);
      else if (g.imp === LMH.M)
        populateData(tryCFs, cfs, g.sy, yearRange.from, g.ccy);
      else populateData(optCFs, cfs, g.sy, yearRange.from, g.ccy);
      mergeCFs(mCFs, cfs, g.sy, g.ccy);
    });
    setMustCFs([...mustCFs]);
    setOptCFs([...optCFs]);
    setTryCFs([...tryCFs]);
    setMergedCFs(mCFs);
    calculateFFYear(mCFs, mustCFs, tryCFs);
    setGoalsLoaded(true);
  }, [allGoals]);

  const addGoal = async (newGoal: CreateGoalInput, cfs: Array<number> = []) => {
    let g = null;
    try {
      g = await createNewGoal(newGoal as CreateGoalInput);
    } catch (err) {
      notification.error({
        message: "Goal Not Created",
        description: "Sorry! Unable to create this Goal: " + err,
      });
      return false;
    }
    if (!g) return false;
    setGoal(null);
    if (g.type === GoalType.FF) {
      setFFGoal(g);
      setAllGoals([
        ...(allGoals?.sort(
          (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
        ) as Array<CreateGoalInput>),
      ]);
      return true;
    }
    notification.success({
      message: "New Goal Created",
      description: `Success! New Goal ${g.name} has been Created.`,
    });
    allGoals?.push(g as CreateGoalInput);
    allCFs[g.id as string] = cfs;
    setAllCFs(allCFs);
    setAllGoals([
      ...(allGoals?.sort(
        (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
      ) as Array<CreateGoalInput>),
    ]);
  };

  const updateGoal = async (g: UpdateGoalInput, cfs: Array<number> = []) => {
    let savedGoal: UpdateGoalInput | null = null;
    try {
      savedGoal = await changeGoal(g as UpdateGoalInput);
    } catch (err) {
      notification.error({
        message: "Goal not Updated",
        description: "Sorry! Unable to update this Goal: " + err,
      });
      return false;
    }
    if (!savedGoal) return false;
    setGoal(null);
    if (savedGoal.type === GoalType.FF) {
      notification.success({
        message: "Target Updated",
        description:
          "Success! Your Financial Independence Target has been Updated.",
      });
      setFFGoal(savedGoal as CreateGoalInput);
      setAllGoals([
        ...(allGoals?.sort(
          (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
        ) as Array<CreateGoalInput>),
      ]);
      return true;
    }
    notification.success({
      message: "Goal Updated",
      description: `Success! Goal ${savedGoal.name} has been Updated.`,
    });
    if (allGoals && allGoals.length) {
      let existingGoalIndex = -1;
      for (let i = 0; i < allGoals.length; i++) {
        if (allGoals[i].id === savedGoal.id) {
          existingGoalIndex = i;
          break;
        }
      }
      if (existingGoalIndex >= 0)
        allGoals[existingGoalIndex] = savedGoal as CreateGoalInput;
    }
    allCFs[savedGoal.id] = cfs;
    setAllCFs(allCFs);
    setAllGoals([
      ...(allGoals?.sort(
        (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
      ) as Array<CreateGoalInput>),
    ]);
    return true;
  };

  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
    } catch (err) {
      notification.error({
        message: "Delete Error",
        description: "Sorry! Unable to delete this Goal: " + err,
      });
      return false;
    }
    notification.success({
      message: "Goal Deleted",
      description: `Success! Goal has been Deleted.`,
    });
    removeFromArray(allGoals as Array<CreateGoalInput>, "id", id);
    delete allCFs[id];
    setAllCFs(allCFs);
    setGoal(null);
    setAllGoals([
      ...(allGoals?.sort(
        (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
      ) as Array<CreateGoalInput>),
    ]);
  };

  const editGoal = (id: string) => {
    if (id === ffGoal?.id) {
      setGoal(ffGoal);
      return;
    }
    if (!allGoals || !allGoals.length) return;
    setGoal(allGoals.filter((g) => g.id === id)[0]);
  };

  const getYearRange = () => {
    let fromYear = nowYear + 1;
    if (!ffGoal || !allGoals || !allGoals[0])
      return { from: fromYear, to: fromYear };
    let toYear = nowYear + 1;
    allGoals.forEach((g) => {
      let endYear = g.sy + allCFs[g.id as string].length;
      if (endYear > toYear) toYear = endYear;
    });
    let ffGoalEndYear = ffGoal.sy + (ffGoal.loan?.dur as number);
    if (toYear > ffGoalEndYear) toYear = ffGoalEndYear;
    return { from: fromYear, to: toYear };
  };

  const populateWithZeros = (firstYear: number, lastYear: number) => {
    let cfs: Array<number> = [];
    for (let year = firstYear; year <= lastYear; year++) {
      cfs.push(0);
    }
    return cfs;
  };

  const populateData = (
    totalCfs: Array<number>,
    cfs: Array<number>,
    sy: number,
    firstYear: number,
    goalCurrency: string
  ) => {
    let firstIndex = sy - firstYear;
    let currencyFactor = getCurrencyFactor(goalCurrency);
    cfs.forEach((cf, i) => {
      if (firstIndex + i >= 0) totalCfs[firstIndex + i] += cf * currencyFactor;
    });
  };

  const mergeCFs = (
    obj: Object,
    cfs: Array<number>,
    sy: number,
    goalCurrency: string
  ) => {
    let currencyFactor = getCurrencyFactor(goalCurrency);
    cfs.forEach((cf, i) => {
      let year = sy + i;
      appendValue(obj, year, cf * currencyFactor);
    });
  };

  const calculateFFImpactYear = (
    startYear: number,
    cfs: Array<number>,
    goalId: string,
    goalImp: LMH,
    goalCurrency: string,
    result?: any,
    mergedCashflows?: any,
    mustCashflows?: any,
    tryCashflows?: any
  ) => {
    if (!ffGoal) return null;
    let mCFs: any = Object.assign(
      {},
      mergedCashflows ? mergedCashflows : mergedCFs
    );
    let highImpCFs: any = Object.assign(
      [],
      mustCashflows ? mustCashflows : mustCFs
    );
    let medImpCFs: any = Object.assign(
      [],
      tryCashflows ? tryCashflows : tryCFs
    );
    let nowYear = new Date().getFullYear();
    let currencyFactor = getCurrencyFactor(goalCurrency);
    if (goalId) {
      let existingGoal = (
        allGoals?.filter((g) => g.id === goalId) as Array<CreateGoalInput>
      )[0];
      let existingSY = existingGoal.sy;
      let existingImp = existingGoal.imp;
      let existingCFs = allCFs[goalId];
      existingCFs.forEach((cf: number, i: number) => {
        let cashFlow = -cf * currencyFactor;
        appendValue(mCFs, existingSY + i, cashFlow);
        let index = existingSY + i - (nowYear + 1);
        if (existingImp === LMH.H) {
          appendValue(highImpCFs, index, cashFlow);
        } else if (existingImp === LMH.M) {
          appendValue(medImpCFs, index, cashFlow);
        }
      });
    }
    let nomineeAmt = ffGoal?.sa as number;
    let resultWithoutGoal = findEarliestFFYear(
      ffGoal,
      mCFs,
      result ? result.ffYear : ffYear,
      highImpCFs,
      medImpCFs
    );
    if (!isFFPossible(resultWithoutGoal, nomineeAmt))
      return {
        impactYears: null,
        rr: resultWithoutGoal.rr,
      };
    cfs.forEach((cf, i) => {
      let cashFlow = cf * currencyFactor;
      appendValue(mCFs, startYear + i, cashFlow);
      let index = startYear + i - (nowYear + 1);
      if (goalImp === LMH.H) {
        appendValue(highImpCFs, index, cashFlow);
      } else if (goalImp === LMH.M) {
        appendValue(medImpCFs, index, cashFlow);
      }
    });
    let resultWithGoal = result
      ? result
      : findEarliestFFYear(
          ffGoal,
          mCFs,
          result ? result.ffYear : ffYear,
          highImpCFs,
          medImpCFs
        );
    if (!isFFPossible(resultWithGoal, nomineeAmt))
      return {
        impactYears: null,
        rr: resultWithoutGoal.rr,
      };
    return {
      impactYears: resultWithoutGoal.ffYear - resultWithGoal.ffYear,
      rr: resultWithoutGoal.rr,
    };
  };

  return (
    <PlanContext.Provider
      value={{
        allGoals,
        setAllGoals,
        allCFs,
        mustCFs,
        tryCFs,
        optCFs,
        mergedCFs,
        goalsLoaded,
        ffResult,
        ffGoal,
        rr,
        addGoal,
        updateGoal,
        editGoal,
        removeGoal,
        calculateFFImpactYear,
        goal,
        setGoal,
        isPublicCalc,
        dr,
        setDR,
        planError,
        setPlanError,
        ffYear,
        oppCostCache,
        setOppCostCache,
      }}>
      {children}
    </PlanContext.Provider>
  );
}

export { PlanContext, PlanContextProvider };
