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
  const defaultDuration = 20;

  const calculateOppCost = () => {
    if (!props.cfs || props.cfs.length === 0) {
      setOppCost(0);
      return;
    }
    let oppCost = 0;
    const startIndex = props.startYear - (new Date().getFullYear() + 1);
    props.cfs.forEach((cf, index) => {
      oppCost += cf;
      if (index < props.cfs.length - 1)
        oppCost = getCompoundedIncome(
          typeof props.discountRate === "number"
            ? props.discountRate
            : props.discountRate[startIndex + index],
          oppCost,
          1
        );
    });
    if (!props.buyGoal) {
      if (typeof props.discountRate !== "number") {
        let year = props.startYear + props.cfs.length - 1;
        for (
          let i = startIndex + props.cfs.length - 1;
          i < props.discountRate.length - (getMinRetirementDuration() + 1);
          i++, year++
        )
          oppCost = getCompoundedIncome(props.discountRate[i], oppCost, 1);
        setLastYear(year);
      } else
        oppCost = getCompoundedIncome(
          props.discountRate,
          oppCost,
          defaultDuration
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
          ? `in ${defaultDuration} Years`
          : `when You turn ${lastYear - (props.ffGoalEndYear - PLAN_DURATION)}`
      } if You 
        ${oppCost < 0 ? "Invest" : "Buy"} instead of ${
        oppCost < 0 ? (props.buyGoal ? "Buying" : "Spending") : "Investing"
      }.`}
    />
  );
}
