import React, { useEffect, useState } from "react";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import SelectInput from "../form/selectinput";
import { changeSelection, initYearOptions } from "../utils";
interface RetIncomeProps {
  inputOrder: number;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
  currency: string;
  rangeFactor: number;
  endYear: number;
  retirementIncome: number;
  retirementIncomeHandler: Function;
  retirementIncomePer: number;
  retirementIncomePerHandler: Function;
  retirementIncomeSY: number;
  retirementIncomeSYHandler: Function;
}

export default function RetIncome({
  inputOrder,
  currentOrder,
  allInputDone,
  nextStepHandler,
  currency,
  rangeFactor,
  endYear,
  retirementIncome,
  retirementIncomeHandler,
  retirementIncomePer,
  retirementIncomePerHandler,
  retirementIncomeSY,
  retirementIncomeSYHandler,
}: RetIncomeProps) {
  const [ryOptions, setRYOptions] = useState(initYearOptions(endYear - 30, 15));

  useEffect(() => {
    setRYOptions(initYearOptions(endYear - 30, 15));
    if (retirementIncomeSY > endYear - 15 || retirementIncomeSY < endYear - 30)
      retirementIncomeSYHandler(endYear - 20);
  }, [endYear]);

  return (
    <Section
      title="Retirement Income Benefit (eg: Pension, Social Security, etc.)"
      left={
        <NumberInput
          name="ri"
          inputOrder={inputOrder}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          value={retirementIncome}
          changeHandler={retirementIncomeHandler}
          rangeFactor={rangeFactor}
          pre="Yearly"
          post="Benefit"
          min={0}
          max={50000}
          step={500}
          currency={currency}
        />
      }
      right={
        retirementIncome ? (
          <NumberInput
            name="richgper"
            inputOrder={inputOrder + 1}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            value={retirementIncomePer}
            changeHandler={retirementIncomePerHandler}
            pre="Benefit"
            post="Increases"
            note="Yearly"
            min={0}
            max={3}
            step={0.1}
            unit="%"
          />
        ) : (
          !allInputDone && currentOrder === inputOrder + 1 && nextStepHandler()
        )
      }
      bottom={
        retirementIncome ? (
          <SelectInput
            name="risy"
            inputOrder={inputOrder + 2}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            allInputDone={allInputDone}
            nextStepHandler={nextStepHandler}
            info="When do You Plan to Receive the Benefit? Around 70 years of age is preferable for optimal benefit."
            value={retirementIncomeSY}
            options={ryOptions}
            pre="From"
            post="Onwards"
            changeHandler={(val: string) => {
              changeSelection(val, retirementIncomeSYHandler);
            }}
          />
        ) : (
          !allInputDone && currentOrder === inputOrder + 2 && nextStepHandler()
        )
      }
      insideForm
    />
  );
}
