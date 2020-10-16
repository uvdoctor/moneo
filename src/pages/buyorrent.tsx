import React from "react";
import { GoalType } from "../api/goals";
import Layout from "../components/calc/Layout";
import ItemDisplay from "../components/calc/ItemDisplay";
import SVGBalance from "../components/calc/svgbalance";
import SVGBarChart from "../components/svgbarchart";
import SVGChart from "../components/svgchart";
import SVGHourGlass from "../components/svghourglass";
import SVGScale from "../components/svgscale";
import { CALC_NAMES } from "../CONSTANTS";

export default function BuyOrRent() {
  return (
    <Layout
      title={CALC_NAMES.BR}
      type={GoalType.B}
      titleSVG={<SVGScale selected />}
      assumptions={["adfas", "asdfsad"]}
      features={["fsdgdf", "fgdssdf"]}
      results={[
        <ItemDisplay
          result="Option that costs lesser"
          svg={<SVGBalance />}
        />,
        <ItemDisplay
          result="Time till which the Option costs lesser"
          svg={<SVGHourGlass />}
        />,
        <ItemDisplay
          result={`Yearly Cash Flows for Buying`}
          svg={<SVGChart selected />}
        />,
        <ItemDisplay
          result="Yearly Interest & Principal if Bought via Loan"
          svg={<SVGBarChart selected />}
        />
      ]}
      resultImg="step1.png"
    />
  );
}