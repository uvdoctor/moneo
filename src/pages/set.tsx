import React, { useState } from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import { CreateGoalInput } from "../api/goals";
import { PlanContextProvider } from "../components/goals/PlanContext";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

const Set = () => {
  const [goal, setGoal] = useState<CreateGoalInput | null>(null);

  return (
    <BasicPage
      title={"Set Plan"}
      className="calculator-container steps-landing"
      navScrollable
      fixedNav
      isSecured={true}
    >
      <PlanContextProvider goal={goal} setGoal={setGoal}>
        <SetPlan />
      </PlanContextProvider>
    </BasicPage>
  );
};

export default Set;
