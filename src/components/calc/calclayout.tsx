import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { ToastContainer } from "react-toastify";
import { CreateGoalInput, GoalType } from "../../api/goals";
import { ASSET_TYPES, ROUTES } from "../../CONSTANTS";
import ExpandCollapse from "../form/expandcollapse";
import FFGoal from "../goals/ffgoal";
import Goal from "../goals/goal";
import { createNewGoalInput } from "../goals/goalutils";
import Header from "../header";

interface CalcLayoutProps {
  title: string;
  titleSVG: React.ReactNode;
  type: GoalType;
  features: Array<any>;
  assumptions: Array<any>;
  results: Array<any>;
  resultImg: string;
}

export default function CalcLayout(props: CalcLayoutProps) {
  const router = useRouter();
  const [wipGoal, setWIPGoal] = useState<CreateGoalInput | null>(null);
  const [ffResult, setFFResult] = useState<any>({});
  const nowYear = new Date().getFullYear();
  const sections: any = {
    "Expected Results": props.results,
    "Key Features": props.features,
    "Major Assumptions": props.assumptions,
  };

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

  const createGoal = () => {
    let g: CreateGoalInput = createNewGoalInput(props.type, "USD");
    g.name = props.title;
    setWIPGoal(g);
  };

  return (
    <div className="text-lg">
      <ToastContainer />
      {!wipGoal ? (
        <Fragment>
          <Header />
          <div className="mt-16 w-full text-center">
            <div className="flex w-full justify-center items-center">
              {props.titleSVG}
              <h1 className="ml-1 md:text-xl lg:text-2xl font-bold">
                {props.title + " Calculator"}
              </h1>
            </div>
            {Object.keys(sections).map((key, i) => (
              <div key={"section" + i} className="mt-4">
                <ExpandCollapse title={key} insideCalc>
                  <Fragment>
                    <div
                      className={`w-full flex flex-col justify-center items-center ${
                        sections[key] === props.results &&
                        "md:flex-row md:flex-wrap md:justify-around"
                      }`}
                    >
                      {sections[key].map((item: any, i: number) => (
                        <div className="md:mt-2 md:mr-2" key={"item" + i}>
                          {item}
                        </div>
                      ))}
                    </div>
                    {sections[key] === props.results && (
                      <img className="cursor-pointer object-fit"
                        src={"/images/"+props.resultImg}
                        onClick={createGoal}
                      />
                    )}
                  </Fragment>
                </ExpandCollapse>
              </div>
            ))}
            <div className="mt-4">
              <AwesomeButton
                ripple
                type="primary"
                size="medium"
                onPress={createGoal}
              >
                START
              </AwesomeButton>
            </div>
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
