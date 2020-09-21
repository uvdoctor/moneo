import React, { useState, useEffect } from "react";
import { getCompoundedIncome } from "./finance";
import SVGBalance from "./svgbalance";
import ResultItem from "./resultitem";
import { toCurrency } from "../utils";
import { getMinRetirementDuration } from "../goals/goalutils";
import { PLAN_DURATION } from "../../CONSTANTS";
interface OppCostProps {
  cfs: Array<number>;
  currency: string;
  discountRate: number | Array<number>;
  startYear: number;
  ffGoalEndYear: number;
  buyGoal: boolean;
}

export default function OppCost(props: OppCostProps) {
  const [oppCost, setOppCost] = useState<number>(0);
  const [lastYear, setLastYear] = useState<number>(
    props.startYear + props.cfs.length - 1
  );
  const minDuration = 20;

  const calculateOppCost = () => {
    if (!props.cfs || props.cfs.length === 0) {
      setOppCost(0);
      return;
    }
    let oppCost = 0;
    const startIndex = props.startYear - (new Date().getFullYear() + 1);
    props.cfs.forEach((cf, index) => {
      console.log("CF is ", cf);
      oppCost += cf;
      console.log("Opp cost after adding cf is: ", oppCost);
      if (index < props.cfs.length - 1 && oppCost < 0) {
        console.log(
          "DR is ",
          typeof props.discountRate === "number"
            ? props.discountRate
            : props.discountRate[startIndex + index]
        );
        oppCost *=
          1 +
          (typeof props.discountRate === "number"
            ? props.discountRate
            : props.discountRate[startIndex + index]) /
            100;
      }
      console.log("Opp cost after compounding is: ", oppCost);
    });
    if (!props.buyGoal) {
      if (typeof props.discountRate !== "number") {
        let year = props.startYear + props.cfs.length - 1;
        for (
          let i = startIndex + props.cfs.length - 1;
          i < props.discountRate.length - (getMinRetirementDuration() + 1);
          i++, year++
        )
          if (oppCost < 0) oppCost *= 1 + props.discountRate[i] / 100;
        setLastYear(year);
      } else if (props.cfs.length - 1 < minDuration && oppCost < 0)
        oppCost = getCompoundedIncome(
          props.discountRate,
          oppCost,
          minDuration - (props.cfs.length - 1)
        );
    }
    setOppCost(oppCost);
  };

  useEffect(() => calculateOppCost(), [props.cfs, props.discountRate]);

  return (
    <ResultItem
      svg={<SVGBalance />}
      result={oppCost}
      currency={props.currency}
      label={`${props.buyGoal ? "Buy" : "Spend"} v/s Invest`}
      pl
      info={`You May Have ${toCurrency(
        Math.abs(oppCost),
        props.currency
      )} More ${
        props.buyGoal
          ? `in ${props.cfs.length - 1} Years`
          : typeof props.discountRate === "number"
          ? `in ${
              props.cfs.length - 1 > minDuration
                ? props.cfs.length
                : minDuration
            } Years`
          : `when You turn ${lastYear - (props.ffGoalEndYear - PLAN_DURATION)}`
      } if You 
        ${oppCost < 0 ? "Invest" : "Buy"} instead of ${
        oppCost < 0 ? (props.buyGoal ? "Buying" : "Spending") : "Investing"
      }.`}
    />
  );
}
