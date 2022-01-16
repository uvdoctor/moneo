import React, { useState } from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";
import { CreateGoalInput } from "../api/goals";
import { PlanContextProvider } from "../components/goals/PlanContext";
import BasicPage from "../components/BasicPage";

Amplify.configure({ ...awsexports, ssr: true });

export default function Set() {
  const [goal, setGoal] = useState<CreateGoalInput | null>(null);

  return (
    <BasicPage
      title={"Moneo - Set"}
      className="calculator-container steps-landing"
      navScrollable
      fixedNav
      secure>
      <PlanContextProvider goal={goal} setGoal={setGoal}>
        <SetPlan />
      </PlanContextProvider>
    </BasicPage>
  );
}
