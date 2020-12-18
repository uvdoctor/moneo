import React, { useEffect, useState, Fragment } from "react";
import { Card, Menu, Space } from "antd";
import { appendValue, removeFromArray } from "../utils";
import YearlyCFChart from "./YearlyCFChart";
import * as APIt from "../../api/goals";
import {
  createNewGoal,
  changeGoal,
  deleteGoal,
  createNewGoalInput,
  getGoalTypes,
  getImpOptions,
  getDuration,
  getGoalsList,
} from "./goalutils";
import { calculateCFs, findEarliestFFYear, isFFPossible } from "./cfutils";
import Summary from "./summary";
import SelectInput from "../form/selectinput";
import SVGTargetPath from "./svgtargetpath";
import {EditOutlined} from "@ant-design/icons";
import { ASSET_TYPES, COLORS } from "../../CONSTANTS";
import AssetAllocationChart from "./AssetAllocationChart";
import { Button, notification } from "antd";
import { GoalContextProvider } from "./GoalContext";
import { CalcContextProvider } from "../calc/CalcContext";
import { FIGoalContextProvider } from "./FIGoalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChartPie, faBullseye } from "@fortawesome/free-solid-svg-icons";

export default function SetPlan() {
  const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>(
    []
  );
  const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false);
  const [ffGoal, setFFGoal] = useState<APIt.CreateGoalInput | null>(null);
  const [allCFs, setAllCFs] = useState<any>({});
  const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null);
  const [mustCFs, setMustCFs] = useState<Array<number>>([]);
  const [tryCFs, setTryCFs] = useState<Array<number>>([]);
  const [optCFs, setOptCFs] = useState<Array<number>>([]);
  const [mergedCFs, setMergedCFs] = useState<any>({});
  const [impFilter, setImpFilter] = useState<string>("");
  const [ffResult, setFFResult] = useState<any>({});
  const [rr, setRR] = useState<Array<number>>([]);
  const goalsLabel = "Goals";
  const cfLabel = "Cash Flows";
  const aaLabel = "Allocation";
  const [viewMode, setViewMode] = useState<string>(goalsLabel);
  const nowYear = new Date().getFullYear();
  const tabOptions = [
    {
      label: goalsLabel,
      svg: faBullseye,
    },
    {
      label: aaLabel,
      svg: faChartPie,
    },
    {
      label: cfLabel,
      svg: faChartLine,
    },
  ];

  const loadAllGoals = async () => {
    let goals: Array<APIt.CreateGoalInput> | null = await getGoalsList();
    if (!goals || goals.length === 0) {
      setGoalsLoaded(true);
      return;
    }
    let allCFs: any = {};
    let ffGoalId = "";
    goals?.forEach((g) => {
      if (g.type === APIt.GoalType.FF) {
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
        allCFs[g.id as string] = result.cfs;
      }
    });
    removeFromArray(goals, "id", ffGoalId);
    setAllCFs(allCFs);
    setAllGoals([...goals]);
  };

  // potential performance
  const getPP = () => {
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
      [ASSET_TYPES.SHORT_TERM_BONDS]: 2 + irDiff, //short term bond <1
      [ASSET_TYPES.MED_TERM_BONDS]: 3 + irDiff, // 1-5 medium term
      [ASSET_TYPES.TAX_EXEMPT_BONDS]: 3.5 + irDiff, //medium term tax efficient bonds
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
    let ffToYear = ffGoal.ey;
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
      getPP()
    );
    if (!isFFPossible(result, ffGoal.sa as number)) {
      result.ffYear = 0;
    }
    setFFResult(result);
    setRR([...result.rr]);
    console.log("FF result: ", result);
  };

  useEffect(() => {
    loadAllGoals().then(() => {});
  }, []);

  useEffect(() => {
    if (!ffGoal) return;
    let yearRange = getYearRange();
    let mustCFs = populateWithZeros(yearRange.from, yearRange.to);
    let tryCFs = populateWithZeros(yearRange.from, yearRange.to);
    let optCFs = populateWithZeros(yearRange.from, yearRange.to);
    let mCFs = buildEmptyMergedCFs(yearRange.from, ffGoal.ey);
    allGoals?.forEach((g) => {
      let cfs: Array<number> = allCFs[g.id as string];
      if (!cfs) return;
      if (g.imp === APIt.LMH.H)
        populateData(mustCFs, cfs, g.sy, yearRange.from);
      else if (g.imp === APIt.LMH.M)
        populateData(tryCFs, cfs, g.sy, yearRange.from);
      else populateData(optCFs, cfs, g.sy, yearRange.from);
      mergeCFs(mCFs, allCFs[g.id as string], g.sy);
    });
    setMustCFs([...mustCFs]);
    setOptCFs([...optCFs]);
    setTryCFs([...tryCFs]);
    setMergedCFs(mCFs);
    calculateFFYear(mCFs, mustCFs, tryCFs);
    setGoalsLoaded(true);
  }, [allGoals]);

  useEffect(() => setWIPGoal(wipGoal), [wipGoal]);

  const addGoal = async (
    goal: APIt.CreateGoalInput,
    cfs: Array<number> = []
  ) => {
    let g = null;
    try {
      g = await createNewGoal(goal);
    } catch (err) {
      notification.error({ message: 'Goal Not Created', description: "Sorry! Unable to create this Goal: " + err });
      return false;
    }
    if (!g) return false;
    setWIPGoal(null);
    if (g.type === APIt.GoalType.FF) {
      setFFGoal(g);
      return true;
    }
    notification.success({message: 'New Goal Created', description: `Success! New Goal ${g.name} has been Created.`});
    allGoals?.push(g as APIt.CreateGoalInput);
    //@ts-ignore
    allCFs[g.id] = cfs;
    setAllCFs(allCFs);
    setAllGoals([...(allGoals as Array<APIt.CreateGoalInput>)]);
  };

  const updateGoal = async (
    goal: APIt.UpdateGoalInput,
    cfs: Array<number> = []
  ) => {
    let g: APIt.UpdateGoalInput | null = null;
    try {
      g = await changeGoal(goal);
    } catch (err) {
      notification.error({message: "Goal not Updated", description: "Sorry! Unable to update this Goal: " + err });
      return false;
    }
    if (!g) return false;
    setWIPGoal(null);
    if (g.type === APIt.GoalType.FF) {
      notification.success({ message: "Target Updated", description: "Success! Your Financial Independence Target has been Updated." });
      setFFGoal(g as APIt.CreateGoalInput);
      return true;
    }
    notification.success({ message: "Goal Updated", description: `Success! Goal ${g.name} has been Updated.` });
    removeFromArray(allGoals as Array<APIt.CreateGoalInput>, "id", goal.id);
    allGoals?.unshift(g as APIt.CreateGoalInput);
    //@ts-ignore
    allCFs[g.id] = cfs;
    setAllCFs(allCFs);
    setAllGoals([...(allGoals as Array<APIt.CreateGoalInput>)]);
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
    removeFromArray(allGoals as Array<APIt.CreateGoalInput>, "id", id);
    //@ts-ignore
    delete allCFs[id];
    setAllCFs(allCFs);
    setWIPGoal(null);
    setAllGoals([...(allGoals as Array<APIt.CreateGoalInput>)]);
  };

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
        type === APIt.GoalType.FF ? "USD" : (ffGoal?.ccy as string)
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
    if (!ffGoal || !ffResult.ffYear) return null;
    let mCFs: any = Object.assign({}, mergedCFs);
    let highImpCFs: any = Object.assign([], mustCFs);
    let medImpCFs: any = Object.assign([], tryCFs);
    let nowYear = new Date().getFullYear();
    if (goalId) {
      let existingGoal = (allGoals?.filter((g) => g.id === goalId) as Array<
        APIt.CreateGoalInput
      >)[0];
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
      mCFs,
      ffResult ? ffResult.ffYear : null,
      highImpCFs,
      medImpCFs,
      getPP()
    );
    console.log("Result without goal: ", resultWithoutGoal.rr);
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
      mCFs,
      resultWithoutGoal.ffYear,
      highImpCFs,
      medImpCFs,
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
      (wipGoal as APIt.CreateGoalInput).type === APIt.GoalType.FF ? (
        <CalcContextProvider goal={wipGoal} addCallback={addGoal}
        updateCallback={updateGoal}>
         
      <FIGoalContextProvider
          mergedCFs={mergedCFs}
          pp={getPP()}
          mustCFs={mustCFs}
          tryCFs={tryCFs}
        />
        </CalcContextProvider>
      ) : (
        ffGoal && (
          <CalcContextProvider goal={wipGoal} addCallback={addGoal}
          updateCallback={updateGoal}>
            <GoalContextProvider
      ffImpactYearsHandler={calculateFFImpactYear}
            ffGoalEndYear={ffGoal?.ey} />
          </CalcContextProvider>
          )
        )
  ) : (
    <Fragment>
        {ffGoal && rr && rr.length > 0 && (
          <Card title="Financial Independence" extra={
            <Button type="link" onClick={() => setWIPGoal(ffGoal)}
              icon={<EditOutlined />}>
              Edit
            </Button>
          }
            style={{
              backgroundColor: isFFPossible(ffResult, ffGoal.sa as number)
                ? COLORS.LIGHT_GREEN : COLORS.LIGHT_GRAY
            }}>
            {isFFPossible(ffResult, ffGoal.sa as number)
              ? `Earliest in ${ffResult.ffYear as number}`
              : `May Not be Possible till You turn 70. Please try again with different Goals / Inputs.`}
          </Card>
      )}
      <div className="flex mt-4 items-center justify-center">
        <SVGTargetPath />
        <label className="ml-2 text-xl md:text-2xl">Define Your Dreams.</label>
      </div>
      <p>
        Make Money Work Hard to Meet Them.
      </p>
      <div className="flex flex-wrap justify-around mb-4">
        {Object.keys(getGoalTypes()).map(
          (key) =>
            key !== APIt.GoalType.FF && (
              <Button
                type="primary"
                key={key}
                disabled={ffGoal === null}
                onClick={() => createGoal(key as APIt.GoalType)}
              >
                {getGoalTypes()[key as APIt.GoalType]}
                </Button>
                )
                )}
      </div>
      {ffGoal && rr && rr.length > 0
        ? allGoals &&
          allGoals.length > 0 && (
            <Space align="center" direction="vertical" size="large">
              <div className="w-full flex justify-center bg-green-100 py-1 shadow-lg lg:shadow-xl text-sm md:text-base">
                <Space align="end">
                  {viewMode === goalsLabel && (
                      <SelectInput
                        pre=""
                        options={getImpOptions()}
                        value={impFilter as string}
                        changeHandler={setImpFilter}
                      />
                  )}
                  <Menu onClick={(e: any) => setViewMode(e.key)} selectedKeys={[viewMode]} mode="horizontal">
                    {tabOptions.map(tab => 
                      <Menu.Item key={tab.label} icon={<FontAwesomeIcon icon={tab.svg} />}>
                        {tab.label}
                      </Menu.Item>
                    )}  
                  </Menu>
                </Space>
              </div>
              {viewMode !== aaLabel && (
                <p>
                  Negative values imply You Pay, while Positive values imply You
                  Receive
                </p>
              )}
              {viewMode === cfLabel && (
                <YearlyCFChart
                  mustCFs={mustCFs}
                  tryCFs={tryCFs}
                  optCFs={optCFs}
                  from={nowYear + 1}
                  to={ffGoal.ey}
                  currency={ffGoal.ccy}
                />
              )}
              {viewMode === aaLabel && (
                <CalcContextProvider goal={ffGoal} addCallback={addGoal} updateCallback={updateGoal}>
                  <FIGoalContextProvider
                            mergedCFs={mergedCFs}
                            pp={getPP()}
                            mustCFs={mustCFs}
                            tryCFs={tryCFs}
                  >
                    <AssetAllocationChart />
                  </FIGoalContextProvider>
                </CalcContextProvider>
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
                      <CalcContextProvider key={"g"+i} goal={g} addCallback={addGoal} updateCallback={updateGoal}>
                      <GoalContextProvider>
                      <Summary
                        deleteCallback={removeGoal}
                        editCallback={editGoal}
                        ffImpactYears={result?.ffImpactYears as number}
                      />
                        </GoalContextProvider>
                        </CalcContextProvider>
                    );
                  })}
                </div>
              )}
            </Space>
          )
        : goalsLoaded && (
            <div className="text-center align-center">
              <p className="mt-8 md:mt-12 lg:mt-16">First Things First.</p>
              <p className="mb-2">Set Up Financial Independence Target.</p>
              <Button
                type="primary"
                onClick={() => createGoal(APIt.GoalType.FF)}>Get Started</Button>
            </div>
          )}
    </Fragment>
  );
}
