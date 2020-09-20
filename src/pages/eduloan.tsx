import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import * as APIt from "../api/goals";
import Goal from "../components/goals/goal";
import CalcLayout from "../components/calc/calclayout";

export default function EduLoan() {
  const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null);
  const nowYear = new Date().getFullYear();

  return (
    <CalcLayout wipGoal={wipGoal} wipGoalHandler={setWIPGoal}>
      <Goal
        goal={wipGoal as APIt.CreateGoalInput}
        ffGoalEndYear={nowYear + 50}
        cancelCallback={() => setWIPGoal(null)}
      />
    </CalcLayout>
  );
}
