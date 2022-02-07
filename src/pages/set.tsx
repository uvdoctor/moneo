import React, { useState } from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";
import { CreateGoalInput } from "../api/goals";
import { PlanContextProvider } from "../components/goals/PlanContext";
import BasicPage from "../components/BasicPage";
import { getFXData } from "../components/utils";
import { InferGetStaticPropsType } from "next";

Amplify.configure({ ...awsexports, ssr: true });

function Set({ fxRates }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [goal, setGoal] = useState<CreateGoalInput | null>(null);

  return (
    <BasicPage
      title={"Moneo - Set"}
      className="calculator-container steps-landing"
      navScrollable
      fixedNav
      secure>
      <PlanContextProvider goal={goal} setGoal={setGoal} fxRates={fxRates}>
        <SetPlan />
      </PlanContextProvider>
    </BasicPage>
  );
}

export async function getStaticProps() {
  let fxRates = await getFXData("61ff9bf3d40797.93512142");
  return {
    props: {
      fxRates,
    },
  };
}

export default Set;
