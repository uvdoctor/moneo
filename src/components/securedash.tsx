import React, { useState, useEffect, Fragment } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Goals from "../components/goals/goals";
import NW from "./nw/nw";
import { CreateGoalInput, GoalType } from "../api/goals";
import { getGoalsList, getDuration } from "./goals/goalutils";
import { calculateCFs } from "./goals/cfutils";
import { buildTabsArray, removeFromArray } from "./utils";
import Tabs, { DASHBOARD_STYLE } from "./tabs";
import SVGPiggy from "./svgpiggy";
import SVGMoneyBag from "./calc/svgmoneybag";
import SVGPlan from "./svgplan";
import SVGInvest from "./svginvest";

const SecureDash = () => {
  const getLabel = "GET";
  const setLabel = "SET";
  const saveLabel = "SAVE";
  const investLabel = "INVEST";
  const tabs = buildTabsArray({
    [getLabel]: SVGMoneyBag,
    [setLabel]: SVGPlan,
    [saveLabel]: SVGPiggy,
    [investLabel]: SVGInvest,
  });
  const [viewMode, setViewMode] = useState(getLabel);
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
          getDuration(g.sa as number, g.sy, g.ey, g.manual, g.emi?.per,
            g.emi?.ry, g.emi?.dur)
        );
        allCFs[g.id as string] = result.cfs;
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
      {viewMode === getLabel && (
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
      {viewMode === setLabel && (
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
