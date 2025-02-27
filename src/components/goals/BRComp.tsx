import React, { useContext } from "react";
import { CalcContext } from "../calc/CalcContext";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import HSwitch from "../HSwitch";
import { GoalContext } from "./GoalContext";
import { PlanContext } from "./PlanContext";

export default function BRComp() {
  const { dr, setDR }: any = useContext(PlanContext);
  const { currency }: any = useContext(CalcContext);
  const {
    rentAmt,
    setRentAmt,
    rentChgPer,
    setRentChgPer,
    taxRate,
    rentTaxBenefit,
    setRentTaxBenefit,
  }: any = useContext(GoalContext);

  return (
    <Section title="Compare rent option">
      <NumberInput
        pre="Monthly rent"
        value={rentAmt as number}
        changeHandler={setRentAmt}
        step={10}
        currency={currency}
      />
      {taxRate && rentAmt && (
        <HSwitch
          rightText="Claim tax deduction"
          value={rentTaxBenefit}
          setter={setRentTaxBenefit}
        />
      )}
      {rentAmt && (
        <NumberInput
          pre="Rent changes"
          value={rentChgPer as number}
          changeHandler={setRentChgPer}
          min={-5}
          max={10}
          step={0.1}
          unit="% yearly"
        />
      )}
      {rentAmt && (
        <NumberInput
          value={dr}
          changeHandler={setDR}
          min={1}
          max={15}
          step={0.1}
          pre="Money saved by not buying earns"
          unit="% yearly"
          post="after taxes & fees"
        />
      )}
    </Section>
  );
}
