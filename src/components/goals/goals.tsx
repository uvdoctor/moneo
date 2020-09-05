import React, { useEffect, useState, Fragment } from "react";
import Goal from "./goal";
import FFGoal from "./ffgoal";
import { appendValue, removeFromArray } from "../utils";
import CFChart from "./cfchart";
import * as APIt from "../../api/goals";
import {
  createNewGoal,
  changeGoal,
  deleteGoal,
  createNewGoalInput,
  getGoalTypes,
  getImpOptions,
} from "./goalutils";
import { findEarliestFFYear, isFFPossible } from "./cfutils";
import Summary from "./summary";
import SelectInput from "../form/selectinput";
import SVGTargetPath from "./svgtargetpath";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import SVGEdit from "../svgedit";
import { toast } from "react-toastify";
import { useFullScreen } from "react-browser-hooks";
import Tabs from "../tabs";
import { ASSET_TYPES } from "../../CONSTANTS";
import SVGBarChart from "../svgbarchart";
import TreeMapChart from "./treemapchart";
import SVGAAChart from "./svgaachart";
import SVGList from "../svglist";
interface GoalsProps {
  showModalHandler: Function;
  savings: number;
  annualSavings: number;
  avgAnnualExpense: number;
  expChgRate: number;
  currency: string;
  allGoals: Array<APIt.CreateGoalInput> | null;
  allCFs: any;
  goalsLoaded: boolean;
  ffGoal: APIt.CreateGoalInput | null;
  allGoalsHandler: Function;
  allCFsHandler: Function;
  ffGoalHandler: Function;
}

export default function Goals({
  showModalHandler,
  savings,
  annualSavings,
  avgAnnualExpense,
  expChgRate,
  currency,
  allGoals,
  allCFs,
  goalsLoaded,
  ffGoal,
  allGoalsHandler,
  allCFsHandler,
  ffGoalHandler,
}: GoalsProps) {
  const { fullScreen } = useFullScreen();
  const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null);
  const [mustCFs, setMustCFs] = useState<Array<number>>([]);
  const [tryCFs, setTryCFs] = useState<Array<number>>([]);
  const [optCFs, setOptCFs] = useState<Array<number>>([]);
  const [mergedCFs, setMergedCFs] = useState<any>({});
  const [impFilter, setImpFilter] = useState<string>("");
  const [ffResult, setFFResult] = useState<any>({});
  const [ffYear, setFFYear] = useState<number | null>(0);
  const [rr, setRR] = useState<Array<number>>([]);
  const goalsLabel = "Goals";
  const cfLabel = "Cash Flows";
  const aaLabel = "Allocation";
  const [viewMode, setViewMode] = useState<string>(goalsLabel);
  const nowYear = new Date().getFullYear();
  const tabOptions = [
    {
      label: goalsLabel,
      order: 1,
      active: true,
      svg: SVGList,
    },
    {
      label: aaLabel,
      order: 2,
      active: true,
      svg: SVGAAChart,
      svglabel: nowYear + 1,
    },
    {
      label: cfLabel,
      order: 3,
      active: true,
      svg: SVGBarChart,
      svglabel: currency,
    },
  ];
  const irDiffByCurrency: any = {
    INR: 3,
  };

  // potential performance
  const getPP = () => {
    let irDiff = irDiffByCurrency[currency];
    if (!irDiff) irDiff = 0;
    return {
      [ASSET_TYPES.SAVINGS]: 0.5 + irDiff,
      [ASSET_TYPES.DEPOSITS]: 1.5 + irDiff,
      [ASSET_TYPES.SHORT_TERM_BONDS]: 2 + irDiff, //short term bond <1
      [ASSET_TYPES.MED_TERM_BONDS]: 3 + irDiff, // 1-5 medium term
      [ASSET_TYPES.TAX_EXEMPT_BONDS]: 3.5 + irDiff, //medium term tax efficient bonds
      [ASSET_TYPES.DOMESTIC_REIT]: 5 + irDiff,
      [ASSET_TYPES.INTERNATIONAL_REIT]: 5 + irDiff,
      [ASSET_TYPES.GOLD]: 3,
      [ASSET_TYPES.LARGE_CAP_STOCKS]: 5 + irDiff,
      [ASSET_TYPES.MID_CAP_STOCKS]: 6 + irDiff,
      [ASSET_TYPES.DIVIDEND_GROWTH_STOCKS]: 5 + irDiff,
      [ASSET_TYPES.INTERNATIONAL_STOCKS]: 9,
      [ASSET_TYPES.SMALL_CAP_STOCKS]: 9,
      [ASSET_TYPES.DIGITAL_CURRENCIES]: 10,
    };
  };

  const buildEmptyMergedCFs = (fromYear: number, toYear: number) => {
    if (!ffGoal) return {};
    let mCFs = {};
    let ffToYear = ffGoal.ey;
    if (toYear < ffToYear) toYear = ffToYear;
    for (let year = fromYear; year <= toYear; year++)
      //@ts-ignore
      mCFs[year] = 0;
    return mCFs;
  };

  const calculateFFYear = () => {
    if (!ffGoal) return;
    let result = findEarliestFFYear(
      ffGoal,
      savings,
      mergedCFs,
      annualSavings,
      ffYear,
      mustCFs,
      tryCFs,
      avgAnnualExpense,
      expChgRate,
      getPP()
    );
    if (!isFFPossible(result, ffGoal.sa as number)) {
      setFFYear(null);
      setFFResult(result);
      setRR([...result.rr]);
    } else {
      if (!ffYear || ffYear < result.ffYear || ffYear > ffGoal.ey - 30) {
        setFFYear(result.ffYear);
        setFFResult(result);
        setRR([...result.rr]);
      }
    }
  };

  useEffect(() => {
    calculateFFYear();
  }, [savings, annualSavings, mustCFs]);

  useEffect(() => {
    if (!ffGoal) return;
    let yearRange = getYearRange();
    let mustCFs = populateWithZeros(yearRange.from, yearRange.to);
    let tryCFs = populateWithZeros(yearRange.from, yearRange.to);
    let optCFs = populateWithZeros(yearRange.from, yearRange.to);
    let mCFs = buildEmptyMergedCFs(yearRange.from, ffGoal.ey);
    allGoals?.forEach((g) => {
      //@ts-ignore
      let cfs: Array<number> = allCFs[g.id];
      if (!cfs) return;
      if (g.imp === APIt.LMH.H)
        populateData(mustCFs, cfs, g.sy, yearRange.from);
      else if (g.imp === APIt.LMH.M)
        populateData(tryCFs, cfs, g.sy, yearRange.from);
      else populateData(optCFs, cfs, g.sy, yearRange.from);
      //@ts-ignore
      mergeCFs(mCFs, allCFs[g.id], g.sy);
    });
    setMustCFs([...mustCFs]);
    setOptCFs([...optCFs]);
    setTryCFs([...tryCFs]);
    setMergedCFs(mCFs);
  }, [allGoals]);

  useEffect(() => showModalHandler(wipGoal), [wipGoal]);

  const addGoal = async (
    goal: APIt.CreateGoalInput,
    cfs: Array<number> = []
  ) => {
    let g = null;
    try {
      g = await createNewGoal(goal);
    } catch (err) {
      toast.error("Sorry! Unable to create this Goal: " + err, {
        autoClose: 7000,
      });
      return false;
    }
    if (!g) return false;
    setWIPGoal(null);
    if (g.type === APIt.GoalType.FF) {
      ffGoalHandler(g);
      return true;
    }
    toast.success(`Success! New Goal ${g.name} has been Created.`, {
      autoClose: 3000,
    });
    allGoals?.push(g as APIt.CreateGoalInput);
    //@ts-ignore
    allCFs[g.id] = cfs;
    allCFsHandler(allCFs);
    allGoalsHandler([...(allGoals as Array<APIt.CreateGoalInput>)]);
  };

  const updateGoal = async (
    goal: APIt.UpdateGoalInput,
    cfs: Array<number> = []
  ) => {
    let g: APIt.UpdateGoalInput | null = null;
    try {
      g = await changeGoal(goal);
    } catch (err) {
      toast.error("Sorry! Unable to update this Goal: " + err, {
        autoClose: 7000,
      });
      return false;
    }
    if (!g) return false;
    setWIPGoal(null);
    if (g.type === APIt.GoalType.FF) {
      toast.success(
        "Success! Your Financial Freedom Target has been Updated.",
        { autoClose: 3000 }
      );
      ffGoalHandler(g as APIt.CreateGoalInput);
      return true;
    }
    toast.success(`Success! Goal ${g.name} has been Updated.`);
    removeFromArray(allGoals as Array<APIt.CreateGoalInput>, "id", goal.id);
    allGoals?.unshift(g as APIt.CreateGoalInput);
    //@ts-ignore
    allCFs[g.id] = cfs;
    allCFsHandler(allCFs);
    allGoalsHandler([...(allGoals as Array<APIt.CreateGoalInput>)]);
    return true;
  };

  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
    } catch (err) {
      toast.error("Sorry! Unable to delete this Goal: " + err, {
        autoClose: 7000,
      });
      return false;
    }
    toast.success(`Success! Goal has been Deleted.`, { autoClose: 3000 });
    removeFromArray(allGoals as Array<APIt.CreateGoalInput>, "id", id);
    //@ts-ignore
    delete allCFs[id];
    allCFsHandler(allCFs);
    setWIPGoal(null);
    allGoalsHandler([...(allGoals as Array<APIt.CreateGoalInput>)]);
  };

  const cancelGoal = () => setWIPGoal(null);

  const editGoal = (id: string) => {
    if (!allGoals) return;
    let g: Array<APIt.CreateGoalInput> = allGoals.filter((g) => g.id === id);
    if (g && g.length === 1) {
      setWIPGoal(g[0]);
    }
  };

  const createGoal = (type: APIt.GoalType) =>
    setWIPGoal(
      createNewGoalInput(
        type,
        type === APIt.GoalType.FF ? currency : (ffGoal?.ccy as string)
      )
    );

  const getYearRange = () => {
    let fromYear = nowYear + 1;
    if (!ffGoal || !allGoals || !allGoals[0])
      return { from: fromYear, to: fromYear };
    let toYear = nowYear + 1;
    allGoals.forEach((g) => {
      //@ts-ignore
      let endYear = g.sy + allCFs[g.id].length;
      if (endYear > toYear) toYear = endYear;
    });
    if (toYear > ffGoal.ey) toYear = ffGoal.ey;
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
    goalImp: APIt.LMH
  ) => {
    if (!ffGoal || !ffYear) return null;
    let mCFs: any = Object.assign({}, mergedCFs);
    let highImpCFs: any = Object.assign([], mustCFs);
    let medImpCFs: any = Object.assign([], tryCFs);
    let nowYear = new Date().getFullYear();
    if (goalId) {
      //@ts-ignore
      let existingGoal = (allGoals?.filter((g) => g.id === goalId))[0];
      let existingSY = existingGoal.sy;
      let existingImp = existingGoal.imp;
      let existingCFs = allCFs[goalId];
      existingCFs.forEach((cf: number, i: number) => {
        appendValue(mCFs, existingSY + i, -cf);
        let index = existingSY + i - (nowYear + 1);
        if (existingImp === APIt.LMH.H) {
          appendValue(highImpCFs, index, -cf);
        } else if (existingImp === APIt.LMH.M) {
          appendValue(medImpCFs, index, -cf);
        }
      });
    }
    //@ts-ignore
    let nomineeAmt = ffGoal?.sa as number;
    let resultWithoutGoal = findEarliestFFYear(
      ffGoal,
      savings,
      mCFs,
      annualSavings,
      ffYear,
      highImpCFs,
      medImpCFs,
      avgAnnualExpense,
      expChgRate,
      getPP()
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
      if (goalImp === APIt.LMH.H) {
        appendValue(highImpCFs, index, cf);
      } else if (goalImp === APIt.LMH.M) {
        appendValue(medImpCFs, index, cf);
      }
    });
    let resultWithGoal = findEarliestFFYear(
      ffGoal,
      savings,
      mCFs,
      annualSavings,
      resultWithoutGoal.ffYear,
      highImpCFs,
      medImpCFs,
      avgAnnualExpense,
      expChgRate,
      getPP()
    );
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

  return wipGoal ? (
    <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
      <div className="relative bg-white border-0">
        {wipGoal.type === APIt.GoalType.FF ? (
          <FFGoal
            goal={wipGoal as APIt.CreateGoalInput}
            addCallback={addGoal}
            cancelCallback={cancelGoal}
            updateCallback={updateGoal}
            annualSavings={annualSavings}
            totalSavings={savings}
            ffYear={ffYear}
            ffResult={ffResult}
            mergedCfs={mergedCFs}
            ffYearHandler={setFFYear}
            ffResultHandler={setFFResult}
            rrHandler={setRR}
            pp={getPP()}
            avgAnnualExp={avgAnnualExpense}
            expChgRate={expChgRate}
            mustCFs={mustCFs}
            tryCFs={tryCFs}
          />
        ) : (
          ffGoal && (
            <Goal
              goal={wipGoal as APIt.CreateGoalInput}
              addCallback={addGoal}
              cancelCallback={cancelGoal}
              updateCallback={updateGoal}
              ffImpactYearsHandler={calculateFFImpactYear}
              ffGoalEndYear={ffGoal.ey}
            />
          )
        )}
      </div>
    </div>
  ) : (
    <Fragment>
      {ffGoal && (
        <div
          className={`w-full ${
            isFFPossible(ffResult, ffGoal.sa as number)
              ? "bg-green-100"
              : "bg-red-100"
          } shadow-lg lg:shadow-xl`}
        >
          <div
            className={`w-full flex justify-center items-center ${
              isFFPossible(ffResult, ffGoal.sa as number)
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <label className="p-2 font-semibold text-lg md:text-xl">
              {isFFPossible(ffResult, ffGoal.sa as number)
                ? `Financial Freedom at ${
                    (ffYear as number) - (ffGoal.ey - 100)
                  }`
                : `Financial Freedom May Not be Possible till You turn 70. Please try again with different Goals / Inputs.`}
            </label>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setWIPGoal(ffGoal)}
            >
              <SVGEdit />
              <span className="text-blue-600 hover:text-blue-800">Edit</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex mt-4 items-center justify-center">
        <SVGTargetPath />
        <label className="ml-2 text-xl md:text-2xl">Define Your Dreams.</label>
      </div>
      <p className="text-center text-lg mt-1">
        Make Money Work Hard to Meet Them.
      </p>
      <div className="flex flex-wrap justify-around mb-4">
        {Object.keys(getGoalTypes()).map(
          (key) =>
            key !== APIt.GoalType.FF && (
              <AwesomeButton
                className={`mt-4 ${
                  !ffGoal ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                type="primary"
                ripple
                size="medium"
                key={key}
                disabled={!ffGoal}
                onPress={() => createGoal(key as APIt.GoalType)}
              >
                {getGoalTypes()[key as APIt.GoalType]}
              </AwesomeButton>
            )
        )}
      </div>
      {ffGoal
        ? allGoals &&
          allGoals.length > 0 && (
            <Fragment>
              <div className="w-full flex justify-center bg-green-100 py-1 shadow-lg lg:shadow-xl text-sm md:text-base">
                <div className="flex mt-2 items-end justify-center">
                  {viewMode === goalsLabel && (
                    <div className="mr-1 md:mr-2">
                      <SelectInput
                        inputOrder={1}
                        currentOrder={0}
                        nextStepDisabled={true}
                        allInputDone={true}
                        nextStepHandler={() => true}
                        name="typeFilter"
                        pre=""
                        options={getImpOptions()}
                        value={impFilter as string}
                        changeHandler={setImpFilter}
                      />
                    </div>
                  )}
                  <Tabs
                    tabs={tabOptions}
                    selectedTab={viewMode}
                    capacity={tabOptions.length}
                    selectedTabHandler={setViewMode}
                    allInputDone
                    keepCentered
                  />
                </div>
              </div>
              {viewMode !== aaLabel && (
                <p className="text-center text-base mt-4">
                  Negative values imply You Pay, while Positive values imply You
                  Receive
                </p>
              )}
              {viewMode === cfLabel && (
                <CFChart
                  mustCFs={mustCFs}
                  tryCFs={tryCFs}
                  optCFs={optCFs}
                  from={nowYear + 1}
                  to={ffGoal.ey}
                  fullScreen={fullScreen}
                />
              )}
              {viewMode === aaLabel &&
                ffResult &&
                ffResult.aa &&
                ffResult.rr && (
                  <TreeMapChart
                    aa={ffResult.aa}
                    rr={ffResult.rr}
                    fullScreen={fullScreen}
                  />
                )}
              {viewMode === goalsLabel && (
                <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                  {allGoals.map((g: APIt.CreateGoalInput, i: number) => {
                    if (!g.id || (impFilter && impFilter !== g.imp)) return;
                    let result = calculateFFImpactYear(
                      g.sy,
                      allCFs[g.id],
                      g.id,
                      g.imp
                    );
                    return (
                      <Summary
                        key={"g" + i}
                        id={g.id as string}
                        name={g.name}
                        type={g.type}
                        imp={g.imp}
                        rr={rr}
                        //@ts-ignore
                        startYear={g.sy}
                        currency={g.ccy}
                        cfs={allCFs[g.id]}
                        deleteCallback={removeGoal}
                        editCallback={editGoal}
                        ffGoalEndYear={ffGoal.ey}
                        ffOOM={result ? result.ffOOM : null}
                        ffImpactYears={result ? result.ffImpactYears : null}
                      />
                    );
                  })}
                </div>
              )}
            </Fragment>
          )
        : goalsLoaded && (
            <div className="text-center align-center">
              <p className="mt-8 md:mt-12 lg:mt-16">First Things First.</p>
              <p className="mb-2">Set Up Financial Freedom Target.</p>
              <AwesomeButton
                ripple
                type="primary"
                onPress={() => createGoal(APIt.GoalType.FF)}
              >
                GET STARTED
              </AwesomeButton>
            </div>
          )}
    </Fragment>
  );
}
