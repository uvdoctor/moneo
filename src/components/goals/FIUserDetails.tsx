import React, { useContext } from "react";
import { CalcContext } from "../calc/CalcContext";
import DateInput from "../form/DateInput";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import SelectInput from "../form/selectinput";
import { FIGoalContext } from "./FIGoalContext";
import { getRAOptions } from "./goalutils";

export default function FIUserDetails() {
  const { currency, startYear, changeStartYear }: any = useContext(CalcContext);
  const { nw, setNW, riskProfile, setRiskProfile }: any =
    useContext(FIGoalContext);
  const nowYear = new Date().getFullYear();

  return (
    <Section title="Your Details">
      <DateInput
        info="Your birth year is used to calculate the duration for which financial planning is needed."
        title="Birth year"
        startYearValue={startYear}
        startYearHandler={changeStartYear}
        initialValue={nowYear - 60}
        endValue={nowYear - 15}
      />
      <NumberInput
        info={`Total portfolio value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc. Please do NOT include your Home value.`}
        value={nw}
        pre="Total portfolio value"
        min={500}
        max={900000}
        changeHandler={setNW}
        step={100}
        currency={currency}
      />
      <SelectInput
        info="How much risk are you willing to take in order to achieve higher investment return?"
        pre="Can tolerate"
        unit="loss"
        value={riskProfile}
        changeHandler={setRiskProfile}
        options={getRAOptions()}
      />
    </Section>
  );
}
