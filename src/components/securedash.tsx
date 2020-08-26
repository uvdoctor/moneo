import React, { useState, useEffect, Fragment } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Goals from "../components/goals/goals";
import NW from "./nw/nw";
import { CreateGoalInput, GoalType } from "../api/goals";
import { getGoalsList, getDuration } from "./goals/goalutils";
import { calculateCFs } from "./goals/cfutils";
import { buildTabsArray, removeFromArray } from "./utils";
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
  const avgAnnualExpense = 24000;
  const expChgRate = 3;

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
          allCFsHandler={setAllCFs}
          ffGoal={ffGoal}
          ffGoalHandler={setFFGoal}
          avgAnnualExpense={avgAnnualExpense}
          expChgRate={expChgRate}
        />
      )}
    </Fragment>
  );
};

export default withAuthenticator(SecureDash);
