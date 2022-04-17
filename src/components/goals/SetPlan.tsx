import React, { useContext, useState } from "react";
import * as APIt from "../../api/goals";
import { GoalContextProvider } from "./GoalContext";
import { CalcContextProvider } from "../calc/CalcContext";
import { FIGoalContextProvider } from "./FIGoalContext";
import { FeedbackContextProvider } from "../feedback/FeedbackContext";
import PlanView from "./PlanView";
import { PlanContext } from "./PlanContext";
import { Skeleton } from "antd";

export default function SetPlan() {
  const { goal, goalsLoaded }: any = useContext(PlanContext);
  const [activeTab, setActiveTab] = useState<string>("1");

  return goalsLoaded ? (
    goal ? (
      <FeedbackContextProvider>
        <CalcContextProvider>
          {(goal as APIt.CreateGoalInput).type === APIt.GoalType.FF ? (
            <FIGoalContextProvider />
          ) : (
            <GoalContextProvider />
          )}
        </CalcContextProvider>
      </FeedbackContextProvider>
    ) : (
      <PlanView activeTab={activeTab} setActiveTab={setActiveTab} />
    )
  ) : (
    <Skeleton active />
  );
}
