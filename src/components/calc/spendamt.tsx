import React from "react";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import SelectInput from "../form/selectinput";

interface SpendAmtProps {
  inputOrder: number;
  currentOrder: number;
  nextStepHandler: Function;
  allInputDone: boolean;
  freq: string;
  freqHandler: Function;
  amt: number;
  amtHandler: Function;
  currency: string;
  rangeFactor: number;
  duration: number;
  durationHandler: Function;
}

export default function SpendAmt(props: SpendAmtProps) {
  const freqOptions = {
    one: "One time",
    emi: "EMI",
    yearly: "Yearly",
  };

  return (
    <div className="flex w-full justify-around">
      {(props.allInputDone || props.inputOrder <= props.currentOrder) && (
        <Section
          title="Enter Spend Details"
          left={
            <SelectInput
              name="sf"
              pre=""
              currentOrder={props.currentOrder}
              inputOrder={props.inputOrder}
              allInputDone={props.allInputDone}
              nextStepDisabled={false}
              nextStepHandler={props.nextStepHandler}
              value={props.freq}
              changeHandler={props.freqHandler}
              options={freqOptions}
            />
          }
          right={
            <NumberInput
              name="amt"
              pre="Spend"
              currentOrder={props.currentOrder}
              inputOrder={props.inputOrder + 1}
              allInputDone={props.allInputDone}
              nextStepDisabled={props.amt === 0}
              nextStepHandler={props.nextStepHandler}
              value={props.amt}
              changeHandler={props.amtHandler}
              min={0}
              max={100000}
              currency={props.currency}
              rangeFactor={props.rangeFactor}
            />
          }
          bottom={
            props.freq !== "one" && (
              <NumberInput
                name="amt"
                pre="Spend"
                currentOrder={props.currentOrder}
                inputOrder={props.inputOrder + 2}
                allInputDone={props.allInputDone}
                nextStepDisabled={props.duration === 0}
                nextStepHandler={props.nextStepHandler}
                value={props.duration}
                changeHandler={props.durationHandler}
                min={0}
                max={props.freq === 'emi' ? 360 : 20}
                currency={props.currency}
                rangeFactor={props.rangeFactor}
                unit={props.freq === 'emi' ? 'Months' : 'Years'}
              />
            )
          }
        />
      )}
    </div>
  );
}
