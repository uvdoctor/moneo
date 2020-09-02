import React, { useState } from "react";
import { GoalType, TargetInput } from "../../api/goals";
import SelectInput from "../form/selectinput";
import { initYearOptions } from "../utils";
import Cost from "./cost";

interface AmtProps {
  goalType: GoalType;
  goalBY: number;
  ffGoalEndYear: number;
  inputOrder: number;
  currentOrder: number;
  nextStepHandler: Function;
  allInputDone: boolean;
  currency: string;
  currencyHandler: Function;
  rangeFactor: number;
  startYear: number;
  startYearHandler: Function;
  endYear: number;
  endYearHandler: Function;
  manualMode: number;
  manualModeHandler: Function;
  manualTgts: Array<TargetInput>;
  manualTgtsHandler: Function;
  startingPrice: number;
  startingPriceHandler: Function;
  priceChgRate: number;
  priceChgRateHandler: Function;
  price: number;
  eyOptions: any
  videoUrl: string
  videoHandler: Function
}

export default function Amt({
  goalType,
  goalBY,
  ffGoalEndYear,
  inputOrder,
  currentOrder,
  nextStepHandler,
  allInputDone,
  currency,
  currencyHandler,
  rangeFactor,
  startYear,
  startYearHandler,
  endYear,
  endYearHandler,
  manualMode,
  manualModeHandler,
  manualTgts,
  manualTgtsHandler,
  startingPrice,
  startingPriceHandler,
  priceChgRate,
  priceChgRateHandler,
  price,
  eyOptions,
  videoUrl,
  videoHandler
}: AmtProps) {
  const [syOptions] = useState(
    initYearOptions(goalBY + 1, ffGoalEndYear - 20 - (goalBY + 1))
  );
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center w-full">
        <div className="flex justify-around w-full max-w-sm md:max-w-md items-end">
          <SelectInput
            name="ccy"
            inputOrder={inputOrder}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            pre="Currency"
            value={currency}
            changeHandler={currencyHandler}
            currency
          />
          <SelectInput
            name="sy"
            inputOrder={inputOrder + 1}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            pre="When?"
            info="Year in which You Start Paying for the Goal"
            value={startYear}
            changeHandler={startYearHandler}
            options={syOptions}
            actionCount={goalType === GoalType.B && manualMode < 1 ? 2 : 1}
          />
          <SelectInput
            name="ey"
            pre={`Pay Until`}
            value={endYear}
            inputOrder={inputOrder + 2}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            info="Year in which You End Paying for the Goal"
            disabled={goalType === GoalType.B && manualMode < 1}
            changeHandler={endYearHandler}
            options={eyOptions}
          />
        </div>
      </div>
      <div className="flex justify-around w-full mt-4">
        <Cost
          startingCost={startingPrice}
          startingCostHandler={startingPriceHandler}
          rangeFactor={rangeFactor}
          manualTargets={manualTgts}
          manualTargetsHandler={manualTgtsHandler}
          currency={currency}
          cost={price}
          costChgRate={priceChgRate}
          costChgRateHandler={priceChgRateHandler}
          endYear={endYear}
          manualMode={manualMode}
          manualModeHandler={manualModeHandler}
          startYear={startYear}
          baseYear={goalBY}
          leftMax={goalType === GoalType.B ? 1500000 : 50000}
          leftNote={goalType !== GoalType.D ? "including taxes & fees" : ""}
          inputOrder={inputOrder + 3}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          nextStepHandler={nextStepHandler}
          allInputDone={allInputDone}
          videoHandler={videoHandler}
          videoUrl={videoUrl}
        />
      </div>
    </div>
  );
}
