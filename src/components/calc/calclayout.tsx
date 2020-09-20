import { useRouter } from "next/router";
import React, { Fragment} from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { ToastContainer } from "react-toastify";
import { CreateGoalInput, GoalType } from "../../api/goals";
import { CALCS, ROUTES } from "../../CONSTANTS";
import { createNewGoalInput } from "../goals/goalutils";
import Header from "../header";

interface CalcLayoutProps {
  wipGoal: CreateGoalInput | null;
  wipGoalHandler: Function
  children: React.ReactNode;
}

export default function CalcLayout({ wipGoal, wipGoalHandler, children }: CalcLayoutProps) {
  const router = useRouter()

  const getCalcDetails = () => {
    switch(router.pathname) {
      case ROUTES.FI: 
        return {name: CALCS.FI, type: GoalType.FF}
      case ROUTES.BR:
        return {name: CALCS.BR, type: GoalType.B}
      default:
        return ""
    }
  }

  const createGoal = () => {
    let details: any = getCalcDetails()
    let g: CreateGoalInput = createNewGoalInput(details.type, "USD");
    g.name = details.name;
    wipGoalHandler(g);
  };

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
              onPress={createGoal}
            >
              START
            </AwesomeButton>
          </div>
        </Fragment>
      ) : (
        <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
          <div className="relative bg-white border-0">{children}</div>
        </div>
      )}
    </div>
  );
}
