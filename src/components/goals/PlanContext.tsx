import { notification } from "antd";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { CreateGoalInput, GoalType, LMH, UpdateGoalInput } from "../../api/goals";
import { ASSET_TYPES, ROUTES } from "../../CONSTANTS";
import { appendValue, removeFromArray } from "../utils";
import { calculateCFs, findEarliestFFYear, isFFPossible } from "./cfutils";
import { changeGoal, createNewGoal, deleteGoal, getDuration, getGoalsList } from "./goalutils";
import { useRouter } from 'next/router';

const PlanContext = createContext({});

interface PlanContextProviderProps {
  goal: CreateGoalInput | null
  setGoal: Function
  children: ReactNode
}

function PlanContextProvider({ children, goal, setGoal }: PlanContextProviderProps) {
  const router = useRouter();
  const isPublicCalc = router.pathname === ROUTES.SET ? false : true;
  const [allGoals, setAllGoals] = useState<Array<CreateGoalInput> | null>([]);
  const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false);
  const [ffGoal, setFFGoal] = useState<CreateGoalInput | null>(isPublicCalc && goal && goal.type === GoalType.FF ? goal : null);
  const [allCFs, setAllCFs] = useState<any>({});
  const [mustCFs, setMustCFs] = useState<Array<number>>([]);
  const [tryCFs, setTryCFs] = useState<Array<number>>([]);
  const [optCFs, setOptCFs] = useState<Array<number>>([]);
  const [mergedCFs, setMergedCFs] = useState<any>({});
  const [ffResult, setFFResult] = useState<any>({});
  const [rr, setRR] = useState<Array<number>>([]);
  const [dr, setDR] = useState<number | null>(!isPublicCalc ? null : 5);
  const [planError, setPlanError] = useState<string>('');

  const nowYear = new Date().getFullYear();

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
            g.loan?.per,
            g.loan?.ry,
            g.loan?.dur
          )
        );
        allCFs[g.id as string] = {
          cfs: result.cfs,
          ffImpactYears: null,
          oppCost: 0
        }
      }
    });
    removeFromArray(goals, "id", ffGoalId);
    setAllCFs(allCFs);
    setAllGoals([...goals]);
  };

  // potential performance
  const pp = () => {
    const irDiffByCurrency: any = {
      INR: 3,
    };
    let irDiff =
      ffGoal && irDiffByCurrency.hasOwnProperty(ffGoal.ccy)
        ? irDiffByCurrency[ffGoal.ccy]
        : 0;
    return {
      [ASSET_TYPES.SAVINGS]: 0.5 + irDiff,
      [ASSET_TYPES.DEPOSITS]: 1.5 + irDiff,
      [ASSET_TYPES.MED_TERM_BONDS]: 3 + irDiff, // 1-5 medium term
      [ASSET_TYPES.TAX_EXEMPT_BONDS]: 3.5 + irDiff, //medium term tax efficient bonds
      [ASSET_TYPES.EMERGING_BONDS]: 7,
      [ASSET_TYPES.REIT]: 5 + irDiff,
      [ASSET_TYPES.GOLD]: 3,
      [ASSET_TYPES.LARGE_CAP_STOCKS]: 5 + irDiff,
      [ASSET_TYPES.MID_CAP_STOCKS]: 6 + irDiff,
      [ASSET_TYPES.DIVIDEND_GROWTH_STOCKS]: 5 + irDiff,
      [ASSET_TYPES.INTERNATIONAL_STOCKS]: 9,
      [ASSET_TYPES.SMALL_CAP_STOCKS]: 9,
    };
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
    let result = findEarliestFFYear(
      ffGoal,
      mergedCFs,
      ffResult.ffYear ? ffResult.ffYear : null,
      mustCFs,
      tryCFs,
      pp()
    );
    if (!isFFPossible(result, ffGoal.sa as number)) {
      result.ffYear = 0;
    }
    allGoals?.forEach((g) => {
      let goalMetrics: any = allCFs[g.id as string];
      let impactResult: any = calculateFFImpactYear(g.sy, goalMetrics.cfs, g.id as string, g.imp,
        result, mergedCFs, mustCFs, tryCFs);
        goalMetrics.ffImpactYears = impactResult.ffImpactYears;
      })
    setFFResult(result);
    setRR([...result.rr]);
    console.log("FF result: ", result);
  };

  useEffect(() => {
    if (isPublicCalc) {
      setAllGoals([...[]]);
    } else loadAllGoals().then(() => { });
  }, []);

  useEffect(() => {
    if (!ffGoal) return;
    let yearRange = getYearRange();
    let mustCFs = populateWithZeros(yearRange.from, yearRange.to);
    let tryCFs = populateWithZeros(yearRange.from, yearRange.to);
    let optCFs = populateWithZeros(yearRange.from, yearRange.to);
    let mCFs = buildEmptyMergedCFs(yearRange.from, ffGoal.sy + (ffGoal.loan?.dur as number));
    if (isPublicCalc) return;
    allGoals?.forEach((g) => {
      let cfs: Array<number> = allCFs[g.id as string].cfs;
      if (!cfs) return;
      if (g.imp === LMH.H)
        populateData(mustCFs, cfs, g.sy, yearRange.from);
      else if (g.imp === LMH.M)
        populateData(tryCFs, cfs, g.sy, yearRange.from);
      else populateData(optCFs, cfs, g.sy, yearRange.from);
      mergeCFs(mCFs, cfs, g.sy);
    });
    setMustCFs([...mustCFs]);
    setOptCFs([...optCFs]);
    setTryCFs([...tryCFs]);
    setMergedCFs(mCFs);
    calculateFFYear(mCFs, mustCFs, tryCFs);
    setGoalsLoaded(true);
  }, [allGoals]);

  const addGoal = async (
    newGoal: CreateGoalInput, cfs: Array<number> = [],
    ffImpactYears: number | null
  ) => {
    let g = null;
    try {
      g = await createNewGoal(newGoal as CreateGoalInput);
    } catch (err) {
      notification.error({ message: 'Goal Not Created', description: "Sorry! Unable to create this Goal: " + err });
      return false;
    }
    if (!g) return false;
    setGoal(null);
    if (g.type === GoalType.FF) {
      setFFGoal(g);
      return true;
    }
    notification.success({message: 'New Goal Created', description: `Success! New Goal ${g.name} has been Created.`});
    allGoals?.push(g as CreateGoalInput);
    allCFs[g.id as string] = {
      cfs: cfs,
      ffImpactYears: ffImpactYears
    };
    setAllCFs(allCFs);
    setAllGoals([...(allGoals as Array<CreateGoalInput>)]);
  };

  const updateGoal = async (
    g: UpdateGoalInput, cfs: Array<number> = [],
    ffImpactYears: number | null
  ) => {
    let savedGoal: UpdateGoalInput | null = null;
    try {
      savedGoal = await changeGoal(g as UpdateGoalInput);
    } catch (err) {
      notification.error({message: "Goal not Updated", description: "Sorry! Unable to update this Goal: " + err });
      return false;
    }
    if (!savedGoal) return false;
    setGoal(null);
    if (savedGoal.type === GoalType.FF) {
      notification.success({ message: "Target Updated", description: "Success! Your Financial Independence Target has been Updated." });
      setFFGoal(savedGoal as CreateGoalInput);
      return true;
    } 
    notification.success({ message: "Goal Updated", description: `Success! Goal ${savedGoal.name} has been Updated.` });
    removeFromArray(allGoals as Array<CreateGoalInput>, "id", g.id);
    allGoals?.unshift(savedGoal as CreateGoalInput);
    allCFs[savedGoal.id] = {
      cfs: cfs,
      ffImpactYears: ffImpactYears
    };
    setAllCFs(allCFs);
    setAllGoals([...(allGoals as Array<CreateGoalInput>)]);
    return true;
  };

  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
    } catch (err) {
      notification.error({ message: "Delete Error", description: "Sorry! Unable to delete this Goal: " + err });
      return false;
    }
    notification.success({ message: "Goal Deleted", description: `Success! Goal has been Deleted.`});
    removeFromArray(allGoals as Array<CreateGoalInput>, "id", id);
    //@ts-ignore
    delete allCFs[id];
    setAllCFs(allCFs);
    setGoal(null);
    setAllGoals([...(allGoals as Array<CreateGoalInput>)]);
  };

  const editGoal = (id: string) => {
    if (!allGoals) return;
    let g: CreateGoalInput = (allGoals.filter((g) => g.id === id))[0];
    setGoal(g);
  };

  const cancelGoal = () => setGoal(null);

  const getYearRange = () => {
    let fromYear = nowYear + 1;
    if (!ffGoal || !allGoals || !allGoals[0])
      return { from: fromYear, to: fromYear };
    let toYear = nowYear + 1;
    allGoals.forEach((g) => {
      let endYear = g.sy + allCFs[g.id as string].cfs.length;
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
    firstYear: number
  ) => {
    let firstIndex = sy - firstYear;
    cfs.forEach((cf, i) => {
      if (firstIndex + i >= 0) totalCfs[firstIndex + i] += cf;
    });
  };

  const mergeCFs = (obj: Object, cfs: Array<number>, sy: number) => {
    cfs.forEach((cf, i) => {
      let year = sy + i;
      appendValue(obj, year, cf);
    });
  };

  const calculateFFImpactYear = (
    startYear: number,
    cfs: Array<number>,
    goalId: string,
    goalImp: LMH,
    result?: any,
    mergedCashflows?: any,
    mustCashflows?: any,
    tryCashflows?: any
  ) => {
    if (!ffGoal || (result && !result.ffYear) || (!result && !ffResult.ffYear)) return {
      ffImpactYears: null,
      rr: null,
      ffOOM: null,
    };
    let mCFs: any = Object.assign({}, mergedCashflows ? mergedCashflows : mergedCFs);
    let highImpCFs: any = Object.assign([], mustCashflows ? mustCashflows : mustCFs);
    let medImpCFs: any = Object.assign([], tryCashflows ? tryCashflows : tryCFs);
    let nowYear = new Date().getFullYear();
    if (goalId) {
      let existingGoal = (allGoals?.filter((g) => g.id === goalId) as Array<
        CreateGoalInput
      >)[0];
      let existingSY = existingGoal.sy;
      let existingImp = existingGoal.imp;
      let existingCFs = allCFs[goalId].cfs;
      existingCFs.forEach((cf: number, i: number) => {
        appendValue(mCFs, existingSY + i, -cf);
        let index = existingSY + i - (nowYear + 1);
        if (existingImp === LMH.H) {
          appendValue(highImpCFs, index, -cf);
        } else if (existingImp === LMH.M) {
          appendValue(medImpCFs, index, -cf);
        }
      });
    }
    let nomineeAmt = ffGoal?.sa as number;
    let resultWithoutGoal = findEarliestFFYear(
      ffGoal,
      mCFs,
      ffResult ? ffResult.ffYear : null,
      highImpCFs,
      medImpCFs,
      pp()
    );
    if (!isFFPossible(resultWithoutGoal, nomineeAmt))
      return {
        ffImpactYears: null,
        rr: resultWithoutGoal.rr,
        ffOOM: resultWithoutGoal.oom,
      };
    cfs.forEach((cf, i) => {
      appendValue(mCFs, startYear + i, cf);
      let index = startYear + i - (nowYear + 1);
      if (goalImp === LMH.H) {
        appendValue(highImpCFs, index, cf);
      } else if (goalImp === LMH.M) {
        appendValue(medImpCFs, index, cf);
      }
    });
    let resultWithGoal = result ? result : findEarliestFFYear(
      ffGoal,
      mCFs,
      resultWithoutGoal.ffYear,
      highImpCFs,
      medImpCFs,
      pp()
    );
    console.log("Result with goal: ", resultWithGoal);
    if (!isFFPossible(resultWithGoal, nomineeAmt))
      return {
        ffImpactYears: null,
        rr: resultWithoutGoal.rr,
        ffOOM: resultWithGoal.oom,
      };
    return {
      ffImpactYears: resultWithoutGoal.ffYear - resultWithGoal.ffYear,
      rr: resultWithoutGoal.rr,
      ffOOM: resultWithGoal.oom,
    };
  };


  return (
    <PlanContext.Provider
      value={{
        allGoals,
        setAllGoals,
        allCFs,
        setAllCFs,
        mustCFs,
        setMustCFs,
        tryCFs,
        setTryCFs,
        optCFs,
        setOptCFs,
        mergedCFs,
        setMergedCFs,
        goalsLoaded,
        setGoalsLoaded,
        ffResult,
        setFFResult,
        ffGoal,
        setFFGoal,
        rr,
        setRR,
        addGoal,
        updateGoal,
        editGoal,
        removeGoal,
        cancelGoal,
        calculateFFImpactYear,
        pp,
        goal,
        setGoal,
        isPublicCalc,
        dr,
        setDR,
        planError,
        setPlanError
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export { PlanContext, PlanContextProvider };
