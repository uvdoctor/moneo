import React from "react";
import { GoalType } from "../api/goals";
import Layout from "../components/calc/Layout";
import ItemDisplay from "../components/calc/ItemDisplay";
import SVGBalance from "../components/calc/svgbalance";
import SVGBarChart from "../components/svgbarchart";
import SVGChart from "../components/svgchart";
import SVGHourGlass from "../components/svghourglass";
import { CALC_NAMES } from "../CONSTANTS";
import { CalcContextProvider } from "../components/calc/CalcContext";

export default function BuyOrRent() {
  return (
    <CalcContextProvider title={CALC_NAMES.BR} type={GoalType.B}>
    <Layout
      assumptions={["adfas", "asdfsad"]}
      features={["fsdgdf", "fgdssdf"]}
      results={[
        <ItemDisplay
          key="1"
          result="Option that costs lesser"
          svg={<SVGBalance />}
        />,
        <ItemDisplay
          key="2"
          result="Time till which the Option costs lesser"
          svg={<SVGHourGlass />}
        />,
        <ItemDisplay
          key="3"
          result={`Yearly Cash Flows for Buying`}
          svg={<SVGChart selected />}
        />,
        <ItemDisplay
          key="4"
          result="Yearly Interest & Principal if Bought via Loan"
          svg={<SVGBarChart selected />}
        />
      ]}
      resultImg="step1.png"
      />
      </CalcContextProvider>
  );
}