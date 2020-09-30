import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { CreateGoalInput, GoalType } from "../../api/goals";
import { ROUTES } from "../../CONSTANTS";
import DDPage from "../ddpage";
import ExpandCollapse from "../form/expandcollapse";
import FFGoal from "../goals/ffgoal";
import Goal from "../goals/goal";
import { createNewGoalInput } from "../goals/goalutils";
import Header from "../header";
import * as gtag from "../../lib/gtag";
import Calculator from "./calculator";

interface CalcLayoutProps {
  title: string;
  titleSVG: React.ReactNode;
  type: GoalType | string;
  features: Array<any>;
  assumptions: Array<any>;
  results: Array<any>;
  resultImg: string;
}

export default function CalcLayout(props: CalcLayoutProps) {
  const router = useRouter();
  const [wipGoal, setWIPGoal] = useState<any | null>(null);
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

  const createGoal = () => {
    let g: any = null;
    if (typeof props.type === "string") {
      g = {};
    } else g = createNewGoalInput(props.type as GoalType, "USD");
    g.name = props.title;
    gtag.event({
      category: "Calculator",
      action: "Start",
      label: "type",
      value: props.type,
    });
    setWIPGoal(g);
  };

  return (
    <DDPage title={props.title}>
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
                      <img
                        className="cursor-pointer object-fit"
                        src={"/images/" + props.resultImg}
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
              />
            ) : typeof props.type !== "string" ? (
              <Goal
                goal={wipGoal as CreateGoalInput}
                ffGoalEndYear={nowYear + 50}
                cancelCallback={() => setWIPGoal(null)}
              />
            ) : (
              <Calculator
                calc={wipGoal}
                cancelCallback={() => setWIPGoal(null)}
              />
            )}
          </div>
        </div>
      )}
    </DDPage>
  );
}
