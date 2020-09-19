import React, { Fragment, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Header from "../components/header";
import * as APIt from "../api/goals";
import { createNewGoalInput } from "../components/goals/goalutils";
import Goal from "../components/goals/goal";
import { ToastContainer } from "react-toastify";

export default function BuyOrRent() {
  const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null);
  const nowYear = new Date().getFullYear();

  const createBuyGoal = () => {
    let g: APIt.CreateGoalInput = createNewGoalInput(APIt.GoalType.B, "USD")
    g.name="Buy v/s Rent Calculator"
    setWIPGoal(g)
  }

  return (
    <div className="text-lg">
      <ToastContainer />  
      {!wipGoal ? (
        <Fragment>
          <Header />
          <div className="mt-16 w-full text-center">
            <AwesomeButton
              ripple
              type="primary"
              size="medium"
              onPress={createBuyGoal}
            >
              START
            </AwesomeButton>
          </div>
        </Fragment>
      ) : (
        <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
          <div className="relative bg-white border-0">
            <Goal
              goal={wipGoal}
              ffGoalEndYear={nowYear + 30}
              cancelCallback={() => setWIPGoal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
