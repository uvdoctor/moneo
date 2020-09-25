import React from "react";
import { GoalType } from "../api/goals";
import CalcLayout from "../components/calc/calclayout";
import ResultItem from "../components/calc/resultitem";
import SVGBalance from "../components/calc/svgbalance";
import SVGBarChart from "../components/svgbarchart";
import SVGChart from "../components/svgchart";
import SVGHourGlass from "../components/svghourglass";
import SVGScale from "../components/svgscale";
import { CALC_NAMES } from "../CONSTANTS";

export default function BuyOrRent() {
  return (
    <CalcLayout
      title={CALC_NAMES.BR}
      type={GoalType.B}
      titleSVG={<SVGScale selected />}
      assumptions={["adfas", "asdfsad"]}
      features={["fsdgdf", "fgdssdf"]}
      results={[
        <ResultItem
          result="Option that costs lesser"
          svg={<SVGBalance />}
        />,
        <ResultItem
          result="Time till which the Option costs lesser"
          svg={<SVGHourGlass />}
        />,
        <ResultItem
          result={`Yearly Cash Flows for Buying`}
          svg={<SVGChart selected />}
        />,
        <ResultItem
          result="Yearly Interest & Principal if Bought via Loan"
          svg={<SVGBarChart selected />}
        />
      ]}
      resultImg="step1.png"
    />
  );
}