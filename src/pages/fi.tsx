import React from "react";
import { GoalType } from "../api/goals";
import CalcLayout from "../components/calc/calclayout";
import ResultItem from "../components/calc/resultitem";
import SVGAAChart from "../components/goals/svgaachart";
import SVGBarChart from "../components/svgbarchart";
import SVGChart from "../components/svgchart";
import SVGFreedom from "../components/svgfreedom";
import SVGHourGlass from "../components/svghourglass";
import SVGPiggy from "../components/svgpiggy";
import { CALC_NAMES } from "../CONSTANTS";

export default function FI() {
  const nowYear = new Date().getFullYear();

  return (
    <CalcLayout
      title={CALC_NAMES.FI}
      titleSVG={<SVGFreedom />}
      type={GoalType.FF}
      assumptions={["adfas", "asdfsad"]}
      features={["fsdgdf", "fgdssdf"]}
      results={[
        <ResultItem
          result="Earliest Possible Year for FI"
          svg={<SVGHourGlass />}
        />,
        <ResultItem
          result="Savings Needed for FI"
          svg={<SVGPiggy selected />}
        />,
        <ResultItem
          result={`${nowYear + 1} Asset Allocation`}
          svg={<SVGAAChart selected />}
        />,
        <ResultItem
          result={`Asset Allocation Plan from ${nowYear + 2} Onwards`}
          svg={<SVGBarChart selected />}
        />,
        <ResultItem
          result={`Yearly Savings from ${nowYear + 1} Onwards`}
          svg={<SVGChart selected />}
        />,
      ]}
      resultImg="step1.png"
    />
  );
}
