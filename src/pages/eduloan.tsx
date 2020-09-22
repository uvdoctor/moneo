import React from "react";
import { GoalType } from "../api/goals";
import CalcLayout from "../components/calc/calclayout";
import ResultItem from "../components/calc/resultitem";
import SVGMoneyBag from "../components/calc/svgmoneybag";
import SVGBarChart from "../components/svgbarchart";
import SVGChart from "../components/svgchart";
import SVGEduLoan from "../components/svgeduloan";
import { CALC_NAMES } from "../CONSTANTS";

export default function EduLoan() {
  return (
    <CalcLayout
      title={CALC_NAMES.EDU_LOAN}
      type={GoalType.E}
      titleSVG={<SVGEduLoan />}
      assumptions={["adfas", "asdfsad"]}
      features={["fsdgdf", "fgdssdf"]}
      results={[
        <ResultItem result={`Yearly Cash Flows`} svg={<SVGChart selected />} />,
        <ResultItem
          result="Simple Interest Payment Schedule While Studying"
          svg={<SVGMoneyBag selected />}
        />,
        <ResultItem
          result="Yearly Interest & Principal for EMI Payments"
          svg={<SVGBarChart selected />}
        />,
      ]}
      resultImg="step1.png"
    />
  );
}
