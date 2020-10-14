import React from "react";
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import { getRangeFactor, toCurrency } from "../utils";
import { LMH } from "../../api/goals";
import { getRAOptions } from "./goalutils";

interface FIInvestProps {
  currency: string;
  nw: number;
  nwHandler: Function;
  avgMonthlySavings: number;
  avgMonthlySavingsHandler: Function;
  monthlySavingsRate: number;
  monthlySavingsRateHandler: Function;
  riskProfile?: LMH | null;
  riskProfileHandler?: Function | null;
  rr?: number | null;
  rrHandler?: Function | null;
}

export function FIInvest({
  currency,
  nw,
  nwHandler,
  avgMonthlySavings,
  avgMonthlySavingsHandler,
  monthlySavingsRate,
  monthlySavingsRateHandler,
  riskProfile,
  riskProfileHandler,
  rr,
  rrHandler,
}: FIInvestProps) {
  const rangeFactor = getRangeFactor(currency);

  return (
    <Section
      title="Before Financial Independence"
      videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}
      left={
        <NumberInput
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
          info={`Average Monthly Savings after paying all taxes & expenses. 
                  Include Your Retirement Contributions as a part of Your Savings. 
                  You Can Put Negative Value if Your Expenses are More than Income. 
                  This will be used to forecast Your Future Savings.`}
          value={avgMonthlySavings}
          pre="Monthly"
          min={-5000}
          max={10000}
          post="Investment"
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
              info={`Given Average Monthly Investment of ${toCurrency(
                avgMonthlySavings,
                currency
              )}, ${monthlySavingsRate}% monthly increase in investment comes to about 
          ${toCurrency(
            Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)),
            currency
          )} 
          for this month. Due to the power of compounding, even small regular increase in investment can make a significant impact in the long term.`}
              pre="Increase Investment"
              post="Every Month by"
              unit="%"
              value={monthlySavingsRate}
              changeHandler={monthlySavingsRateHandler}
              min={0}
              max={3}
              step={0.1}
              note={`Total ${toCurrency(
                Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)),
                currency
              )} this month`}
            />
          </div>
          <div className="mt-2">
            {riskProfileHandler && riskProfile ? (
              <SelectInput
                info="How much Risk are You willing to take in order to achieve higher Investment Return?"
                pre="Can Tolerate"
                post="Investment Loss"
                value={riskProfile}
                changeHandler={riskProfileHandler}
                options={getRAOptions()}
              />
            ) : (
              <NumberInput
                value={rr as number}
                changeHandler={rrHandler}
                min={0}
                max={10}
                step={0.1}
                pre="Investment"
                post="Earns At least"
                unit="%"
                note="Yearly after taxes & fees"
              />
            )}
          </div>
        </div>
      }
    />
  );
}
