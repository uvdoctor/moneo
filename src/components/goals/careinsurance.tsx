import React, { useState, useEffect } from "react";
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import { changeSelection, initYearOptions, toStringArr } from "../utils";
import RadialInput from "../form/radialinput";
import ResultItem from "../calc/resultitem";
import { calculateTotalCP, calculateTotalCPTaxBenefit } from "../goals/cfutils";

interface CareInsuranceProps {
  inputOrder: number;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
  currency: string;
  rangeFactor: number;
  carePremium: number;
  carePremiumHandler: Function;
  carePremiumSY: number;
  carePremiumSYHandler: Function;
  chgPer: number;
  chgPerHandler: Function;
  maxTaxDed: number;
  maxTaxDedHandler: Function;
  taxRate: number;
  premiumDur: number;
  premiumDurHandler: Function;
  cpBY: number;
  cyOptions: any;
}

export default function CareInsurance({
  inputOrder,
  currentOrder,
  allInputDone,
  nextStepHandler,
  currency,
  rangeFactor,
  carePremium,
  carePremiumHandler,
  carePremiumSY,
  carePremiumSYHandler,
  chgPer,
  chgPerHandler,
  maxTaxDed,
  maxTaxDedHandler,
  taxRate,
  premiumDur,
  premiumDurHandler,
  cpBY,
  cyOptions,
}: CareInsuranceProps) {
  const [totalCP, setTotalCP] = useState<number>(0);
  const [totalTaxBenefit, setTotalTaxBenfit] = useState<number>(0);

  useEffect(() => {
    carePremium > 0
      ? setTotalCP(
          Math.round(
            calculateTotalCP(
              carePremiumSY,
              carePremium,
              chgPer,
              premiumDur,
              cpBY
            )
          )
        )
      : setTotalCP(0);
  }, [carePremiumSY, carePremium, chgPer, premiumDur]);

  useEffect(() => {
    taxRate > 0
      ? setTotalTaxBenfit(
          calculateTotalCPTaxBenefit(
            taxRate,
            maxTaxDed,
            carePremiumSY,
            carePremium,
            chgPer,
            premiumDur,
            cpBY
          )
        )
      : setTotalTaxBenfit(0);
  }, [taxRate, maxTaxDed, carePremiumSY, carePremium, chgPer, premiumDur]);

  return (
    <Section
      title="Long-term Care Insurance"
      //titleInfo="About 70% individuals over age 65 need some form of living assistance for activities such as bathing, dressing, eating, toileting, walking, etc.
      //It isn't covered by traditional health insurance or government-sponsored old-age care programs."
      left={
        <div className="flex flex-col items-center justify-center">
          <NumberInput
            name="cp"
            inputOrder={inputOrder}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            info="How much does annual insurance premium cost today? Actual price will be derived based on this price."
            value={carePremium}
            changeHandler={carePremiumHandler}
            rangeFactor={rangeFactor}
            pre="Yearly"
            post="Premium"
            note="In Today's Money"
            min={0}
            max={7000}
            step={100}
            currency={currency}
          />
          {carePremium ? (
            <div className="flex justify-between items-end w-full">
              <SelectInput
                name="cpsy"
                inputOrder={inputOrder + 1}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                allInputDone={allInputDone}
                nextStepHandler={nextStepHandler}
                info="It may be a good option to buy this insurance when You are healthier (between 60 to 65 years of age) to get lower premiums."
                value={carePremiumSY}
                options={cyOptions}
                pre="Pay"
                post="Onwards"
                changeHandler={(val: string) =>
                  changeSelection(val, carePremiumSYHandler)
                }
              />
              <SelectInput
                name="cpdur"
                inputOrder={inputOrder + 2}
                currentOrder={currentOrder}
                nextStepDisabled={false}
                allInputDone={allInputDone}
                nextStepHandler={nextStepHandler}
                value={premiumDur}
                options={initYearOptions(1, 15)}
                pre="For"
                post="Years"
                changeHandler={(val: string) =>
                  changeSelection(val, premiumDurHandler)
                }
              />
            </div>
          ) : (
            !allInputDone &&
            currentOrder === inputOrder + 2 &&
            nextStepHandler(2)
          )}
        </div>
      }
      right={
        carePremium ? (
          <RadialInput
            inputOrder={inputOrder + 3}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            value={chgPer}
            changeHandler={chgPerHandler}
            pre="Premium Changes"
            label="Yearly"
            labelBottom
            post={
              <ResultItem
                label="Total Premium"
                result={totalCP}
                currency={currency}
              />
            }
            data={toStringArr(0, 10, 0.5)}
            step={0.5}
            unit="%"
          />
        ) : (
          !allInputDone && currentOrder === inputOrder + 3 && nextStepHandler()
        )
      }
      bottomLeft={
        carePremium &&
        taxRate &&
        (allInputDone || currentOrder >= inputOrder + 4) &&
        "Max Yearly"
      }
      bottomRight={
        carePremium &&
        taxRate &&
        (allInputDone || currentOrder >= inputOrder + 4) &&
        "Allowed"
      }
      bottom={
        carePremium && taxRate ? (
          <NumberInput
            name="maxTDL"
            inputOrder={inputOrder + 4}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            pre="Tax"
            post="Deduction"
            currency={currency}
            value={maxTaxDed}
            changeHandler={maxTaxDedHandler}
            width="80px"
            min={0}
            max={5000}
            step={500}
            rangeFactor={rangeFactor}
            note={
              <ResultItem
                label="Total Tax Benefit"
                currency={currency}
                result={totalTaxBenefit}
              />
            }
          />
        ) : (
          !allInputDone && currentOrder === inputOrder + 4 && nextStepHandler()
        )
      }
      insideForm
    />
  );
}
