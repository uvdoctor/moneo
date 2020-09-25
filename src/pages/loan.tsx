import { GetStaticProps } from "next";
import React from "react";
import { GoalType } from "../api/goals";
import CalcLayout from "../components/calc/calclayout";
import ResultItem from "../components/calc/resultitem";
import { EnvProps } from "../components/ddpage";
import SVGBarChart from "../components/svgbarchart";
import SVGChart from "../components/svgchart";
import SVGLoan from "../components/svgloan";
import { CALC_NAMES } from "../CONSTANTS";

export default function Loan({ isProduction }: EnvProps) {
  return (
    <CalcLayout
      isProduction={isProduction}
      title={CALC_NAMES.LOAN}
      type={GoalType.O}
      titleSVG={<SVGLoan selected />}
      assumptions={["adfas", "asdfsad"]}
      features={["fsdgdf", "fgdssdf"]}
      results={[
        <ResultItem result={`Yearly Cash Flows`} svg={<SVGChart selected />} />,
        <ResultItem
          result="Yearly Interest & Principal"
          svg={<SVGBarChart selected />}
        />,
      ]}
      resultImg="step1.png"
    />
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      isProduction: process.env.NODE_ENV === "production",
    },
  };
};
