import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { ToastContainer } from "react-toastify";
import { CreateGoalInput, GoalType } from "../../api/goals";
import { ASSET_TYPES, ROUTES } from "../../CONSTANTS";
import FFGoal from "../goals/ffgoal";
import Goal from "../goals/goal";
import { createNewGoalInput } from "../goals/goalutils";
import Header from "../header";

export default function CalcLayout() {
  const router = useRouter();
  const [wipGoal, setWIPGoal] = useState<CreateGoalInput | null>(null);
  const [ffResult, setFFResult] = useState<any>({});
  const nowYear = new Date().getFullYear();

  const buildEmptyMergedCFs = () => {
    let mCFs = {};
    for (let year = nowYear + 1; year <= nowYear + 80; year++)
      //@ts-ignore
      mCFs[year] = 0;
    return mCFs;
  };

  const getPP = () => {
    return {
      [ASSET_TYPES.SAVINGS]: 0.5,
      [ASSET_TYPES.DEPOSITS]: 1.5,
      [ASSET_TYPES.SHORT_TERM_BONDS]: 2, //short term bond <1
      [ASSET_TYPES.MED_TERM_BONDS]: 3, // 1-5 medium term
      [ASSET_TYPES.TAX_EXEMPT_BONDS]: 3.5, //medium term tax efficient bonds
      [ASSET_TYPES.DOMESTIC_REIT]: 5,
      [ASSET_TYPES.INTERNATIONAL_REIT]: 5,
      [ASSET_TYPES.GOLD]: 3,
      [ASSET_TYPES.LARGE_CAP_STOCKS]: 5,
      [ASSET_TYPES.MID_CAP_STOCKS]: 6,
      [ASSET_TYPES.DIVIDEND_GROWTH_STOCKS]: 5,
      [ASSET_TYPES.INTERNATIONAL_STOCKS]: 9,
      [ASSET_TYPES.SMALL_CAP_STOCKS]: 9,
    };
  };

  const getCalcDetails = () => {
    switch (router.pathname) {
      case ROUTES.FI:
        return { name: "Financial Independence", type: GoalType.FF };
      case ROUTES.BR:
        return { name: "Buy v/s Rent & Invest", type: GoalType.B };
      case ROUTES.EDUCATION:
        return { name: "Education Loan Calculator", type: GoalType.E };
      case ROUTES.LOAN:
        return { name: "Loan Calculator", type: GoalType.O };

      default:
        return "";
    }
  };

  const createGoal = () => {
    let details: any = getCalcDetails();
    let g: CreateGoalInput = createNewGoalInput(details.type, "USD");
    g.name = details.name;
    setWIPGoal(g);
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
          <div className="relative bg-white border-0">
            {router.pathname === ROUTES.FI ? (
              <FFGoal
                goal={wipGoal as CreateGoalInput}
                mustCFs={[]}
                tryCFs={[]}
                mergedCfs={buildEmptyMergedCFs()}
                cancelCallback={() => setWIPGoal(null)}
                ffResult={ffResult}
                ffResultHandler={setFFResult}
                pp={getPP()}
              />
            ) : (
              <Goal
                goal={wipGoal as CreateGoalInput}
                ffGoalEndYear={nowYear + 50}
                cancelCallback={() => setWIPGoal(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
