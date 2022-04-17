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
import { removeFromArray } from "../utils";
import {
  changeGoal,
  createNewGoal,
  deleteGoal,
  loadAllGoals,
  loadStateFromUserInfo,
} from "./goalutils";
import { useRouter } from "next/router";
import { AppContext } from "../AppContext";
import { calculateFI, calculateFIImpactYears } from "./fiutils";

const PlanContext = createContext({});

interface PlanContextProviderProps {
  goal: CreateGoalInput | null;
  setGoal: Function;
  children: ReactNode;
  fxRates?: any;
}

function PlanContextProvider({
  children,
  goal,
  setGoal,
  fxRates,
}: PlanContextProviderProps) {
  const { appContextLoaded, discountRate, defaultCurrency, userInfo }: any =
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

  useEffect(() => {
    if (!appContextLoaded) return;
    if (isPublicCalc) {
      setAllGoals([...[]]);
      setAllCFs({});
      setGoalsLoaded(true);
    } else
      loadAllGoals(userInfo).then((result: any) => {
        if (!result?.ffGoal) return;
        setFFGoal(result.ffGoal);
        setAllCFs(result.allCFs);
        if (result?.goals && result.goals.length)
          setAllGoals([
            ...(result?.goals.sort(
              (g1: CreateGoalInput, g2: CreateGoalInput) => g1.sy - g2.sy
            ) as Array<CreateGoalInput>),
          ]);
      });
  }, [appContextLoaded, userInfo]);

  useEffect(() => {
    if (!ffGoal || !allGoals) return;
    const result: any = calculateFI(
      ffGoal,
      ffYear,
      allGoals,
      allCFs,
      mergedCFs,
      isPublicCalc,
      defaultCurrency,
      fxRates
    );
    setMustCFs(result.mustCFs);
    setTryCFs(result.tryCFs);
    setOptCFs(result.optCFs);
    setMergedCFs(result.mergeCFs);
    setOppCostCache(result.oppCostCache);
    setFFResult(result.ffResult);
    setFFYear(result.ffYear);
    setRR([...result.rr]);
    setGoalsLoaded(true);
  }, [allGoals]);

  const calculateFFImpactYear = (
    startYear: number,
    cfs: Array<number>,
    goalId: string,
    goalImpLevel: LMH,
    goalCurrency: string
  ) => {
    if (!ffGoal || !allGoals) return;
    return calculateFIImpactYears(
      ffGoal,
      allGoals,
      allCFs,
      ffYear,
      defaultCurrency,
      fxRates,
      startYear,
      cfs,
      goalId,
      goalImpLevel,
      goalCurrency,
      mergedCFs,
      mustCFs,
      tryCFs
    );
  };

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
      loadStateFromUserInfo(userInfo, g);
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
      loadStateFromUserInfo(userInfo, savedGoal as CreateGoalInput);
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
      for (let i = 0; i < allGoals.length; i++) {
        if (allGoals[i].id === savedGoal.id) {
          allGoals[i] = savedGoal as CreateGoalInput;
          break;
        }
      }
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
      }}>
      {children}
    </PlanContext.Provider>
  );
}

export { PlanContext, PlanContextProvider };
