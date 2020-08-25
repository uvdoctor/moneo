import React, { useState, useEffect, Fragment } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Goals from "../components/goals/goals";
import NW from "./nw/nw";
import { CreateGoalInput, GoalType } from "../api/goals";
import { getGoalsList, getDuration } from "./goals/goalutils";
import { calculateCFs } from "./goals/cfutils";
import { buildTabsArray, removeFromArray } from "./utils";
import { ASSET_TYPES } from "../CONSTANTS";
import Tabs, { DASHBOARD_STYLE } from "./tabs";

const SecureDash = () => {
  const netWorthLabel = "Net Worth";
  const goalsLabel = "Plan";
  const saveLabel = "Save";
  const investLabel = "Invest";
  const tabs = buildTabsArray([
    netWorthLabel,
    goalsLabel,
    saveLabel,
    investLabel,
  ]);
  const [viewMode, setViewMode] = useState(netWorthLabel);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [savings, setSavings] = useState<number>(0);
  const [annualSavings, setAnnualSavings] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [allGoals, setAllGoals] = useState<Array<CreateGoalInput> | null>([]);
  const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false);
  const [ffGoal, setFFGoal] = useState<CreateGoalInput | null>(null);
  const [allCFs, setAllCFs] = useState<Object>({});
  const [aa, setAA] = useState<Object>({});
  const [rr, setRR] = useState<Array<number>>([]);
  const avgAnnualExpense = 24000;
  const expChgRate = 3;

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

  useEffect(() => {
    loadAllGoals();
  }, []);

  const loadAllGoals = async () => {
    let goals: Array<CreateGoalInput> | null = await getGoalsList();
    if (!goals || goals.length === 0) {
      setGoalsLoaded(true);
      return;
    }
    let allCFs = {};
    let ffGoalId = "";
    goals?.forEach((g) => {
      if (g.type === GoalType.FF) {
        setFFGoal(g);
        ffGoalId = g.id as string;
      } else {
        //@ts-ignore
        allCFs[g.id] = calculateCFs(
          null,
          g,
          //@ts-ignore
          getDuration(g.sa as number, g.sy, g.ey)
        );
      }
    });
    removeFromArray(goals, "id", ffGoalId);
    setAllCFs(allCFs);
    setAllGoals([...goals]);
    setGoalsLoaded(true);
  };

  return (
    <Fragment>
      {!showModal && (
        <Tabs
          tabs={tabs}
          allInputDone
          capacity={tabs.length}
          selectedTab={viewMode}
          selectedTabHandler={setViewMode}
          customStyle={DASHBOARD_STYLE}
        />
      )}
      {viewMode === netWorthLabel && (
        <NW
          totalSavings={savings}
          annualSavings={annualSavings}
          viewModeHandler={setViewMode}
          totalSavingsHandler={setSavings}
          annualSavingsHandler={setAnnualSavings}
          currency={currency}
          currencyHandler={setCurrency}
        />
      )}
      {viewMode === goalsLabel && (
        <Goals
          showModalHandler={setShowModal}
          savings={savings}
          annualSavings={annualSavings}
          allGoals={allGoals}
          goalsLoaded={goalsLoaded}
          allGoalsHandler={setAllGoals}
          currency={currency}
          allCFs={allCFs}
          aa={aa}
          aaHandler={setAA}
          allCFsHandler={setAllCFs}
          ffGoal={ffGoal}
          ffGoalHandler={setFFGoal}
          rr={rr}
          rrHandler={setRR}
          pp={getPP()}
          avgAnnualExpense={avgAnnualExpense}
          expChgRate={expChgRate}
        />
      )}
    </Fragment>
  );
};

export default withAuthenticator(SecureDash);
