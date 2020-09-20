import React from "react";
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import { getRangeFactor, toCurrency } from "../utils";
import { LMH } from "../../api/goals";
import { getRAOptions } from "./goalutils";

interface InvestProps {
  inputOrder: number;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
  currency: string;
  nw: number;
  nwHandler: Function;
  avgMonthlySavings: number;
  avgMonthlySavingsHandler: Function;
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
  currency,
  nw,
  nwHandler,
  avgMonthlySavings,
  avgMonthlySavingsHandler,
  monthlySavingsRate,
  monthlySavingsRateHandler,
  riskProfile,
  riskProfileHandler,
}: InvestProps) {
  const nowYear = new Date().getFullYear();
  const rangeFactor = getRangeFactor(currency);

  return (
    <Section
      title="Before Financial Freedom"
      videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}
      left={
        <NumberInput
          name="nw"
          inputOrder={inputOrder}
          currentOrder={currentOrder}
          nextStepDisabled={nw === 0}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          info={`Your Total Portfolio Value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc.`}
          value={nw}
          pre="Total"
          min={-100000}
          max={900000}
          post="Portfolio"
          changeHandler={nwHandler}
          step={1000}
          currency={currency}
          rangeFactor={rangeFactor}
        />
      }
      right={
        <NumberInput
          name="ms"
          inputOrder={inputOrder + 1}
          currentOrder={currentOrder}
          nextStepDisabled={avgMonthlySavings === 0}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          infoDurationInMs={10000}
          info={`Average Monthly Savings after paying all taxes & expenses. 
                  Include Your Retirement Contributions as a part of Your Savings. 
                  You Can Put Negative Value if Your Expenses are More than Income. 
                  This will be used to forecast Your Future Savings.`}
          value={avgMonthlySavings}
          pre="Monthly"
          min={-5000}
          max={10000}
          post="Savings"
          changeHandler={avgMonthlySavingsHandler}
          step={100}
          currency={currency}
          rangeFactor={rangeFactor}
          note="on average"
        />
      }
      bottom={
        <div className="w-full flex flex-wrap justify-around items-center">
          <div className="mt-2">
            <NumberInput
              name="savingsRate"
              inputOrder={inputOrder + 2}
              currentOrder={currentOrder}
              nextStepDisabled={false}
              allInputDone={allInputDone}
              nextStepHandler={nextStepHandler}
              info={`Given Average Monthly Saving of ${toCurrency(
                avgMonthlySavings,
                currency
              )}, ${monthlySavingsRate}% monthly increase in savings comes to about 
          ${toCurrency(
            Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)),
            currency
          )} 
          for this month. Due to the power of compounding, even small regular increase in savings can make a significant impact in the long term.`}
              infoDurationInMs={7000}
              pre="Monthly"
              post="Increase"
              unit="%"
              value={monthlySavingsRate}
              changeHandler={monthlySavingsRateHandler}
              min={0}
              max={3}
              step={0.1}
              note={`Total ${toCurrency(
                Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)),
                currency
              )} in ${nowYear + 1}`}
            />
          </div>
          <div className="mt-2">
            <SelectInput
              name="riskProfile"
              inputOrder={inputOrder + 3}
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
          </div>
        </div>
      }
      insideForm
    />
  );
}
