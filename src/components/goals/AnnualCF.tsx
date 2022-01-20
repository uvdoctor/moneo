import React, { useState, useEffect, useContext } from "react";
import Section from "../form/section";
import RadialInput from "../form/radialinput";
import SelectInput from "../form/selectinput";
import { toStringArr, initOptions, toHumanFriendlyCurrency } from "../utils";
import { calculateTotalAmt } from "./cfutils";
import { COLORS } from "../../CONSTANTS";
import { GoalContext } from "./GoalContext";
import { CalcContext } from "../calc/CalcContext";
import { BuyType } from "../../api/goals";
interface AnnualAmtProps {
  income?: boolean;
}

export default function AnnualCF({ income }: AnnualAmtProps) {
  const { currency, startYear }: any = useContext(CalcContext);
  const {
    price,
    sellAfter,
    assetChgRate,
    amCostPer,
    aiPer,
    setAMCostPer,
    setAIPer,
    amStartYear,
    aiStartYear,
    setAMStartYear,
    setAIStartYear,
    buyType,
  }: any = useContext(GoalContext);
  const [syOptions, setSYOptions] = useState<object>(
    initOptions(startYear, sellAfter - 1)
  );
  const [totalAmt, setTotalAmt] = useState<number>(0);
  const title = income
    ? "Income from rent, dividend, etc."
    : "Cost for repairs, insurance, etc.";

  useEffect(() => {
    setSYOptions(initOptions(startYear, sellAfter - 1));
  }, [startYear]);

  useEffect(
    () =>
      setTotalAmt(
        calculateTotalAmt(
          startYear,
          income ? aiPer : amCostPer,
          income ? aiStartYear : amStartYear,
          price,
          assetChgRate,
          sellAfter
        )
      ),
    [
      startYear,
      aiPer,
      amCostPer,
      aiStartYear,
      amStartYear,
      price,
      assetChgRate,
      sellAfter,
    ]
  );

  return (
    <Section title={title}>
      <RadialInput
        colorTo={!income ? COLORS.RED : COLORS.GREEN}
        data={toStringArr(0, 10, 0.1)}
        changeHandler={income ? setAIPer : setAMCostPer}
        unit="%"
        labelBottom={true}
        label="of Price"
        pre={
          buyType === BuyType.P ? (
            <>
              From
              <SelectInput
                pre=""
                options={syOptions}
                value={income ? aiStartYear : amStartYear}
                changeHandler={income ? setAIStartYear : setAMStartYear}
              />
            </>
          ) : null
        }
        value={income ? aiPer : amCostPer}
        post={`Total ${toHumanFriendlyCurrency(totalAmt, currency)} till ${
          startYear + sellAfter
        }`}
        step={0.1}
      />
    </Section>
  );
}
