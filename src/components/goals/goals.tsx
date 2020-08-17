import React, { useEffect, useState, Fragment } from "react";
import Goal from "./goal";
import FFGoal from "./ffgoal";
import { removeFromArray } from "../utils";
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
import { findEarliestFFYear } from "./cfutils";
import Summary from "./summary";
import SelectInput from "../form/selectinput";
import SVGTargetPath from "./svgtargetpath";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import FFResult from "./ffresult";
import SVGEdit from "../svgedit";
import { toast } from "react-toastify";
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
  aa: Object;
  rr: Array<number>;
  pp: Object;
  aaHandler: Function;
  rrHandler: Function;
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
  aa,
  rr,
  pp,
  aaHandler,
  rrHandler,
  allGoalsHandler,
  allCFsHandler,
  ffGoalHandler,
}: GoalsProps) {
  const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null);
  const [mustCFs, setMustCFs] = useState<Array<number>>([]);
  const [tryCFs, setTryCFs] = useState<Array<number>>([]);
  const [optCFs, setOptCFs] = useState<Array<number>>([]);
  const [mergedCFs, setMergedCFs] = useState<any>({});
  const [impFilter, setImpFilter] = useState<string>("");
  const [ffYear, setFFYear] = useState<number | null>(0);
  const [ffAmt, setFFAmt] = useState<number>(0);
  const [ffLeftOverAmt, setFFLeftOverAmt] = useState<number>(0);
  const [ffCfs, setFFCfs] = useState<any>({});
  const [ffMinReq, setFFMinReq] = useState<number>(0);
  const [ffOOM, setFFOOM] = useState<Array<number> | null>(null);
  const goalsLabel = "Goals";
  const cfLabel = "Cash Flows";
  const viewItems = [goalsLabel, cfLabel];
  const [viewMode, setViewMode] = useState(goalsLabel);
  const nowYear = new Date().getFullYear();

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
      null,
      mustCFs,
      tryCFs,
      avgAnnualExpense,
      expChgRate,
      pp
    );
    if (result.ffYear < 0) setFFYear(null);
    else setFFYear(result.ffYear);
    setFFAmt(result.ffAmt);
    //@ts-ignore
    setFFLeftOverAmt(result.leftAmt);
    setFFCfs(result.ffCfs);
    setFFOOM(result.oom);
    aaHandler(result.aa);
    rrHandler([...result.rr]);
    setFFMinReq(result.minReq);
    console.log("Result is ", result);
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

  useEffect(
    () => (wipGoal ? showModalHandler(true) : showModalHandler(false)),
    [wipGoal]
  );

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
      //@ts-ignore
      if (obj[year] !== "undefined") obj[year] += cf;
    });
  };

  const calculateFFImpactYear = (
    startYear: number,
    cfs: Array<number>,
    goalId: string,
    goalImp: APIt.LMH
  ) => {
    if (!ffGoal || !ffYear) return null;
    let mCFs = Object.assign({}, mergedCFs);
    let highImpCFs = Object.assign([], mustCFs);
    let medImpCFs = Object.assign([], tryCFs);
    let nowYear = new Date().getFullYear();
    if (goalId) {
      //@ts-ignore
      let existingGoal = (allGoals?.filter((g) => g.id === goalId))[0];
      let existingSY = existingGoal.sy;
      let existingImp = existingGoal.imp;
      //@ts-ignore
      let existingCFs = allCFs[goalId];
      existingCFs.forEach((cf: number, i: number) => {
        //@ts-ignore
        if (mCFs[existingSY + i] !== "undefined") {
          //@ts-ignore
          mCFs[existingSY + i] -= cf;
        }
        let index = existingSY + i - (nowYear + 1);
        if (existingImp === APIt.LMH.H) {
          //@ts-ignore
          if (highImpCFs[index] !== "undefined") {
            //@ts-ignore
            highImpCFs[index] -= cf;
          }
        } else if (existingImp === APIt.LMH.M) {
          //@ts-ignore
          if (medImpCFs[index] !== "undefined") {
            //@ts-ignore
            medImpCFs[index] -= cf;
          }
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
      pp
    );
    if (
      resultWithoutGoal.ffYear < 0 ||
      resultWithoutGoal.ffAmt < resultWithoutGoal.minReq ||
      resultWithoutGoal.leftAmt < nomineeAmt
    )
      return {
        ffImpactYears: null,
        rr: resultWithoutGoal.rr,
        ffOOM: resultWithoutGoal.oom,
      };
    cfs.forEach((cf, i) => {
      //@ts-ignore
      if (mCFs[startYear + i] !== "undefined") {
        //@ts-ignore
        mCFs[startYear + i] += cf;
      }
      let index = startYear + i - (nowYear + 1);
      if (goalImp === APIt.LMH.H) {
        //@ts-ignore
        if (highImpCFs[index] !== "undefined") {
          //@ts-ignore
          highImpCFs[index] += cf;
        }
      } else if (goalImp === APIt.LMH.M) {
        //@ts-ignore
        if (medImpCFs[index] !== "undefined") {
          //@ts-ignore
          medImpCFs[index] += cf;
        }
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
      pp
    );
    if (
      resultWithGoal.ffYear < 0 ||
      resultWithGoal.ffAmt < resultWithGoal.minReq ||
      resultWithGoal.leftAmt < nomineeAmt
    )
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

  const changeViewMode = (e: any) => {
    setViewMode(e.target.innerText);
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
            aa={aa}
            rr={rr}
            ffYear={ffYear}
            ffAmt={ffAmt}
            ffLeftOverAmt={ffLeftOverAmt}
            ffCfs={ffCfs}
            mergedCfs={mergedCFs}
            ffOOM={ffOOM}
            ffYearHandler={setFFYear}
            ffAmtHandler={setFFAmt}
            ffLeftOverAmtHandler={setFFLeftOverAmt}
            ffMinReqHandler={setFFMinReq}
            ffOOMHandler={setFFOOM}
            ffCfsHandler={setFFCfs}
            rrHandler={rrHandler}
            aaHandler={aaHandler}
            pp={pp}
            ffMinReq={ffMinReq}
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
      {ffGoal ? (
        <Fragment>
          <div className={`flex items-center w-full ${ffYear ? 'bg-green-100' : 'bg-red-100'} shadow-lg lg:shadow-xl`}>
            <FFResult
              endYear={ffGoal.ey}
              ffAmt={ffAmt}
              ffLeftOverAmt={ffLeftOverAmt}
              ffYear={ffYear}
              currency={ffGoal.ccy}
              ffMinReq={ffMinReq}
              ffNomineeAmt={ffGoal?.sa as number}
              ffOOM={ffOOM}
            />
            <div
              className="p-0 pr-1 cursor-pointer"
              onClick={() => setWIPGoal(ffGoal)}
            >
              <SVGEdit />
            </div>
          </div>
          {allGoals && allGoals.length > 0 && (
            <Fragment>
              <ul className="flex flex-wrap justify-center items-center border-b mt-4 w-screen">
                {viewItems.map((item, i) => (
                  <li
                    key={"viewItem" + i}
                    className="cursor-pointer py-1 bg-gray-200"
                  >
                    <a
                      onClick={changeViewMode}
                      style={{
                        color: viewMode === item ? "white" : "gray",
                        backgroundColor:
                          viewMode === item ? "black" : "transparent",
                      }}
                      className="px-4 py-2"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              {viewMode === goalsLabel && (
                <div className="mt-4 flex justify-center">
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
              <p className="text-center text-base mt-4">
                Negative values imply You Pay, while Positive values imply You
                Receive
              </p>
              {viewMode === cfLabel && (
                <CFChart
                  mustCFs={mustCFs}
                  tryCFs={tryCFs}
                  optCFs={optCFs}
                  from={nowYear + 1}
                  to={ffGoal.ey}
                />
              )}
              {viewMode === goalsLabel && (
                <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                  {allGoals.map((g: APIt.CreateGoalInput, i: number) => {
                    if (!g.id || (impFilter && impFilter !== g.imp)) return;
                    //@ts-ignore
                    let result = calculateFFImpactYear(
                      g.sy,
                      allCFs[g.id],
                      g.id,
                      g.imp
                    );
                    return (
                      result && (
                        <Summary
                          key={"g" + i}
                          id={g.id as string}
                          name={g.name}
                          type={g.type}
                          imp={g.imp}
                          rr={result.rr}
                          //@ts-ignore
                          startYear={g.sy}
                          currency={g.ccy}
                          cfs={allCFs[g.id]}
                          deleteCallback={removeGoal}
                          editCallback={editGoal}
                          ffGoalEndYear={ffGoal.ey}
                          ffOOM={ffOOM}
                          ffImpactYears={result.ffImpactYears}
                        />
                      )
                    );
                  })}
                </div>
              )}
            </Fragment>
          )}
        </Fragment>
      ) : (
        goalsLoaded && (
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
        )
      )}
    </Fragment>
  );
}
