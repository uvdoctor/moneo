import React from "react";
import OppCost from "../calc/oppcost";
import FFImpact from "./ffimpact";
import NumberInput from "../form/numberinput";

interface GoalResultProps {
  cfs: Array<number>;
  ffOOM: Array<number> | null;
  ffImpactYears: number | null;
  currency: string;
  startYear: number;
  ffGoalEndYear: number;
  rr: Array<number>;
  buyGoal: boolean;
  dr: number | null;
  drHandler: Function;
}

export default function GoalResult(props: GoalResultProps) {
  return (
    <div className="w-full py-1 flex justify-around items-center w-full items-start bg-green-100 shadow-lg lg:shadow-xl">
      {props.dr === null ? (
        <FFImpact
          ffGoalEndYear={props.ffGoalEndYear}
          ffOOM={props.ffOOM}
          ffImpactYears={props.ffImpactYears}
        />
      ) : (
        <div className="w-full">
          <NumberInput
            name="dr"
            inputOrder={1}
            currentOrder={0}
            allInputDone
            nextStepHandler={() => true}
            nextStepDisabled={false}
            value={props.dr as number}
            changeHandler={props.drHandler}
            min={0}
            max={10}
            step={0.1}
            pre="Investment"
            post="Earns"
            unit="%"
            note="After taxes & fees"
          />
        </div>
      )}
      <div className="w-full">
        <OppCost
          discountRate={props.dr === null ? props.rr : props.dr}
          cfs={props.cfs}
          currency={props.currency}
          startYear={props.startYear}
          buyGoal={props.buyGoal}
          ffGoalEndYear={props.ffGoalEndYear}
        />
      </div>
    </div>
  );
}
