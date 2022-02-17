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
    setAnalyzeFor,
  }: any = useContext(CalcContext);
  const lastStartYear = ffGoal
    ? ffGoal.sy + (ffGoal.loan?.dur as number) - 20
    : goal.by + 30;
  const {
    manualMode,
    impLevel,
    setImpLevel,
    setSellAfter,
    setAssetChgRate,
    buyType,
    setRunningCost,
    setBuyType,
    setAMCostPer,
    setAIPer,
    setManualMode,
    setWIPTargets,
  }: any = useContext(GoalContext);
  const firstStartYear = isPublicCalc ? goal.by - 20 : goal.by + 1;
  const showStartMonth =
    (isPublicCalc || goal.type === GoalType.B) &&
    !manualMode &&
    goal.type !== GoalType.E;

  const buyTypes: any = {
    Property: BuyType.P,
    Vehicle: BuyType.V,
    Other: BuyType.O,
  };

  const getBuyTypeString = (val: BuyType) => {
    for (let key of Object.keys(buyTypes)) {
      if (buyTypes[key] === val) return key;
    }
    return BuyType.P;
  };

  useEffect(() => {
    if (goal.type != GoalType.B) return;
    const isProp = buyType === BuyType.P;
    setAssetChgRate(isProp ? 5 : buyType === BuyType.O ? -20 : -15);
    setSellAfter(isProp ? 20 : 5);
    setAnalyzeFor(isProp ? 30 : 10);
    setAMCostPer(isProp || buyType === BuyType.V ? 2 : 0);
    if (!isProp && buyType !== BuyType.V) setAIPer(0);
    if (buyType !== BuyType.V) setRunningCost(0);
    if (manualMode && !isProp) {
      setManualMode(0);
      setWIPTargets([...[]]);
    }
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
      {!isPublicCalc ? (
        <>
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

            {!isPublicCalc ? (
              <DateInput
                title={goal.type === GoalType.B ? "Buy in" : "Starts"}
                info={`${
                  showStartMonth ? "Month and year" : "Year"
                } when you want to ${
                  goal.type === GoalType.B ? "buy" : "spend"
                }.`}
                startYearValue={startYear}
                startYearHandler={changeStartYear}
                startMonthHandler={showStartMonth ? changeStartMonth : null}
                startMonthValue={showStartMonth ? startMonth : null}
                initialValue={firstStartYear}
                endValue={lastStartYear}
                dateWithEnddate
              />
            ) : null}

            {goal.type !== GoalType.B &&
              !router.pathname.endsWith(ROUTES.LOAN) && (
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
          </Section>
          <p>&nbsp;</p>
        </>
      ) : null}
      <GoalPayment />
    </>
  );
}
