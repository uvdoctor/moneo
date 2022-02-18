import React, { useContext } from "react";
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import HSwitch from "../HSwitch";
import { BuyType, GoalType, TargetInput } from "../../api/goals";
import { toHumanFriendlyCurrency } from "../utils";
import { GoalContext } from "./GoalContext";
import { CalcContext } from "../calc/CalcContext";
import { isLoanEligible } from "./goalutils";
import DateInput from "../form/DateInput";
import { PlanContext } from "./PlanContext";
import { calculateTotalRunningCost } from "./cfutils";

export default function GoalPayment() {
  const {
    goal,
    currency,
    startYear,
    inputTabs,
    setInputTabs,
    endYear,
    changeEndYear,
  }: any = useContext(CalcContext);
  const { ffGoal }: any = useContext(PlanContext);
  const {
    startingPrice,
    setStartingPrice,
    wipTargets,
    setWIPTargets,
    price,
    priceChgRate,
    setPriceChgRate,
    manualMode,
    eduCostSemester,
    setEduCostSemester,
    isLoanMandatory,
    setManualMode,
    buyType,
    runningCost,
    setRunningCost,
    runningCostChg,
    sellAfter,
  }: any = useContext(GoalContext);
  const lastStartYear = ffGoal
    ? ffGoal.sy + (ffGoal.loan?.dur as number) - 20
    : goal.by + 30;

  const changeTargetVal = (val: number, i: number) => {
    if (!wipTargets || !setWIPTargets) return;
    wipTargets[i].val = val;
    setWIPTargets([...wipTargets]);
  };

  const changeManualMode = (value: number) => {
    if (isLoanEligible(goal.type)) {
      const loanTabIndex = 1;
      if (value) {
        if (inputTabs[loanTabIndex].active) {
          inputTabs[loanTabIndex].active = false;
          setInputTabs([...inputTabs]);
        }
      } else {
        if (!inputTabs[loanTabIndex].active) {
          inputTabs[loanTabIndex].active = true;
          setInputTabs([...inputTabs]);
        }
      }
    }
    setManualMode(value);
  };

  const getCostLabel = () =>
    goal.type === GoalType.D
      ? "Amount"
      : goal.type === GoalType.B
      ? "Cost"
      : eduCostSemester
      ? "Cost every 6 months"
      : "Yearly cost";

  return (
    <Section
      title="Payment"
      toggle={
        !isLoanMandatory &&
        goal.type === GoalType.B &&
        buyType === BuyType.P && (
          <HSwitch
            rightText="Multi-year custom plan"
            value={manualMode}
            setter={changeManualMode}
          />
        )
      }>
      {manualMode && (
        <DateInput
          title="Ends"
          key={endYear}
          startYearValue={endYear}
          info="Year in which You End Paying"
          disabled={goal.type === GoalType.B && manualMode < 1}
          startYearHandler={changeEndYear}
          initialValue={startYear}
          endValue={lastStartYear + 20}
          dateWithEnddate
        />
      )}

      {manualMode &&
        wipTargets.length &&
        wipTargets.map((t: TargetInput, i: number) => (
          <NumberInput
            pre={t.num}
            currency={currency}
            value={t.val}
            changeHandler={(val: number) => changeTargetVal(val, i)}
            min={0}
            step={10}
            key={"t" + i}
          />
        ))}

      {!manualMode && (
        <NumberInput
          pre={getCostLabel()}
          info="Please input total amount considering taxes and fees"
          currency={currency}
          value={startingPrice}
          changeHandler={setStartingPrice}
          min={10}
          step={10}
          post={
            goal.type === GoalType.E ? (
              <HSwitch
                value={eduCostSemester}
                setter={setEduCostSemester}
                rightText="Every 6 Months"
              />
            ) : null
          }
        />
      )}

      {goal.type === GoalType.B && buyType === BuyType.V && (
        <NumberInput
          pre="Monthly usage cost"
          info="Monthly cost to use the vehicle (eg: fuel, driver, etc)"
          value={runningCost}
          changeHandler={setRunningCost}
          currency={currency}
          post={
            runningCost
              ? `Total usage cost is ${toHumanFriendlyCurrency(
                  calculateTotalRunningCost(
                    runningCost,
                    runningCostChg,
                    sellAfter
                  ),
                  currency
                )}`
              : ""
          }
        />
      )}

      {startYear > goal.by && !manualMode && goal.type !== GoalType.D && (
        <NumberInput
          pre="Cost changes"
          unit="% yearly"
          min={-10}
          max={10}
          step={0.1}
          value={priceChgRate}
          changeHandler={setPriceChgRate}
          info="Rate at which cost is expected to change on yearly basis considering inflation and other factors."
          post={
            priceChgRate
              ? `${toHumanFriendlyCurrency(price, currency)} in ${startYear}`
              : ""
          }
        />
      )}
    </Section>
  );
}
