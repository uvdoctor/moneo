import React, { useContext, useEffect } from "react";
import SelectInput from "../form/selectinput";
import GoalPayment from "./GoalPayment";
import { GoalContext } from "./GoalContext";
import Section from "../form/section";
import { CalcContext } from "../calc/CalcContext";
import { BuyType, GoalType } from "../../api/goals";
import { PlanContext } from "./PlanContext";
import { getImpLevels } from "./goalutils";
import DateInput from "../form/DateInput";
import RadialInput from "../form/radialinput";
import { toHumanFriendlyCurrency, toStringArr } from "../utils";
import NumberInput from "../form/numberinput";
import { useRouter } from "next/router";
import { ROUTES } from "../../CONSTANTS";
import RadioInput from "../form/RadioInput";

export default function GoalDetails() {
  const router = useRouter();
  const { isPublicCalc, ffGoal }: any = useContext(PlanContext);
  const {
    goal,
    startYear,
    changeStartYear,
    startMonth,
    changeStartMonth,
    currency,
    setCurrency,
    endYear,
    changeEndYear,
  }: any = useContext(CalcContext);
  const lastStartYear = ffGoal
    ? ffGoal.sy + (ffGoal.loan?.dur as number) - 20
    : goal.by + 30;
  const {
    manualMode,
    impLevel,
    setImpLevel,
    sellAfter,
    setSellAfter,
    assetChgRate,
    setAssetChgRate,
    sellPrice,
    buyType,
    runningCost,
    setRunningCost,
    runningCostChg,
    setRunningCostChg,
    setBuyType,
  }: any = useContext(GoalContext);
  const firstStartYear = isPublicCalc ? goal.by - 20 : goal.by + 1;
  const showStartMonth =
    (isPublicCalc || goal.type === GoalType.B) &&
    !manualMode &&
    goal.type !== GoalType.E;

  const buyTypes: any = {
    Property: BuyType.P,
    Vehicle: BuyType.V,
    Electronics: BuyType.E,
    Furniture: BuyType.F,
    Other: BuyType.O,
  };

  const getBuyTypeString = (val: BuyType) => {
    for (let key of Object.keys(buyTypes)) {
      if (buyTypes[key] === val) return key;
    }
    return BuyType.P;
  };

  useEffect(() => {
    setAssetChgRate(
      buyType === BuyType.P ? 5 : buyType === BuyType.E ? -25 : -15
    );
    setSellAfter(buyType === BuyType.P ? 20 : 5);
  }, [buyType]);

  return (
    <>
      {goal.type === GoalType.B && (
        <p>
          <RadioInput
            options={Object.keys(buyTypes)}
            value={getBuyTypeString(buyType)}
            changeHandler={(val: string) => setBuyType(buyTypes[val])}
          />
        </p>
      )}
      <Section
        title="Goal details"
        toggle={
          <SelectInput
            pre=""
            value={currency}
            changeHandler={setCurrency}
            currency
          />
        }>
        {!isPublicCalc && (
          <SelectInput
            pre="Priority"
            value={impLevel}
            changeHandler={setImpLevel}
            options={getImpLevels()}
            info="How important is it for you to achieve this goal? Investment strategy will consider this in order to come up with possible options."
          />
        )}

        <DateInput
          title={goal.type === GoalType.B ? "Buy in" : "Starts"}
          info={`${
            showStartMonth ? "Month and year" : "Year"
          } when you want to ${goal.type === GoalType.B ? "buy" : "spend"}.`}
          startYearValue={startYear}
          startYearHandler={changeStartYear}
          startMonthHandler={showStartMonth ? changeStartMonth : null}
          startMonthValue={showStartMonth ? startMonth : null}
          initialValue={firstStartYear}
          endValue={lastStartYear}
        />

        {goal.type === GoalType.B && buyType === BuyType.V && (
          <NumberInput
            pre="Monthly usage cost"
            info="Monthly cost to use the vehicle (eg: fuel, driver, etc)"
            value={runningCost}
            changeHandler={setRunningCost}
            currency={currency}
          />
        )}

        {goal.type === GoalType.B && buyType === BuyType.V && runningCost && (
          <NumberInput
            pre="Usage cost changes"
            info="Rate at which the usage cost changes in a year"
            value={runningCostChg}
            changeHandler={setRunningCostChg}
            step={0.1}
            max={10}
            unit="% yearly"
          />
        )}

        {goal.type !== GoalType.B && !router.pathname.endsWith(ROUTES.LOAN) && (
          <DateInput
            title="Ends"
            key={endYear}
            startYearValue={endYear}
            info="Year in which You End Paying"
            disabled={goal.type === GoalType.B && manualMode < 1}
            startYearHandler={changeEndYear}
            initialValue={startYear}
            endValue={lastStartYear + 20}
          />
        )}

        {goal.type === GoalType.B && (
          <RadialInput
            info="Years after which you plan to sell."
            label="Years"
            pre="Sell After"
            labelBottom={true}
            data={toStringArr(3, 30)}
            value={sellAfter}
            step={1}
            changeHandler={setSellAfter}
          />
        )}

        {goal.type === GoalType.B && (
          <NumberInput
            info="Approximate rate at which you expect resale value to change yearly."
            pre="Assume resale value changes"
            unit="% yearly"
            post={`Sell price ${toHumanFriendlyCurrency(sellPrice, currency)}`}
            min={-40}
            max={15}
            step={0.5}
            value={assetChgRate}
            changeHandler={setAssetChgRate}
          />
        )}
      </Section>
      <p>&nbsp;</p>
      <GoalPayment />
    </>
  );
}
