import React from "react";
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import { toCurrency } from "../utils";
import { LMH } from "../../api/goals";
import { getRAOptions } from "./goalutils";
import { getCompoundedIncome } from "../calc/finance";

interface InvestProps {
  inputOrder: number;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
  annualSavings: number;
  currency: string;
  monthlySavingsRate: number;
  monthlySavingsRateHandler: Function;
  riskProfile: LMH;
  riskProfileHandler: Function;
}

export function Invest({
  inputOrder,
  currentOrder,
  allInputDone,
  nextStepHandler,
  annualSavings,
  currency,
  monthlySavingsRate,
  monthlySavingsRateHandler,
  riskProfile,
  riskProfileHandler,
}: InvestProps) {
  const nowYear = new Date().getFullYear();
  return (
    <Section
      title="Before Financial Freedom"
      videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}
      left={
        <NumberInput
          name="savingsRate"
          inputOrder={inputOrder}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          info={`Given Annual Savings of ${toCurrency(
            annualSavings,
            currency
          )} by end of ${nowYear}, 
                                        ${monthlySavingsRate}% monthly increase in savings comes to about 
                                        ${toCurrency(
                                          Math.round(
                                            getCompoundedIncome(
                                              monthlySavingsRate * 12,
                                              annualSavings,
                                              1,
                                              12
                                            )
                                          ),
                                          currency
                                        )} in ${
            nowYear + 1
          }. Due to the power of compounding, 
                                        even small regular increase in savings can make a significant impact in the long term.`}
          infoDurationInMs={7000}
          pre="Monthly Savings"
          post="Increases by"
          unit="%"
          value={monthlySavingsRate}
          changeHandler={monthlySavingsRateHandler}
          min={0}
          max={3}
          step={0.1}
          note={`Total ${toCurrency(
            Math.round(
              getCompoundedIncome(monthlySavingsRate * 12, annualSavings, 1, 12)
            ),
            currency
          )} in ${nowYear + 1}`}
        />
      }
      right={
        <SelectInput
          name="riskProfile"
          inputOrder={inputOrder + 1}
          currentOrder={currentOrder}
          options={getRAOptions()}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          info="How much Risk are You willing to take in order to achieve higher Investment Return?"
          pre="Can Tolerate"
          post="Investment Loss"
          value={riskProfile}
          changeHandler={riskProfileHandler}
        />
      }
      insideForm
    />
  );
}
