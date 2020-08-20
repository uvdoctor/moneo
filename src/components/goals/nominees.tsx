import React from 'react'
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import {toCurrency} from "../utils"

interface NomineesProps {
    inputOrder: number;
    currentOrder: number;
    allInputDone: boolean;
    nextStepHandler: Function;
    currency: string;
    rangeFactor: number
    leaveBehind: number
    leaveBehindHandler: Function
    successionTaxRate: number
    successionTaxRateHandler: Function
    endYear: number
}

export default function Nominees({
    inputOrder,
    currentOrder,
    allInputDone,
    nextStepHandler,
    currency,
    rangeFactor,
    leaveBehind,
    leaveBehindHandler,
    successionTaxRate,
    successionTaxRateHandler,
    endYear
}: NomineesProps) {
    return (
        <Section
                title={`Nominees Inherit At least ~ ${toCurrency(
                  Math.round(leaveBehind * (1 - successionTaxRate / 100)),
                  currency
                )}`}
                left={
                  <NumberInput
                    name="lb"
                    inputOrder={inputOrder}
                    currentOrder={currentOrder}
                    nextStepDisabled={false}
                    allInputDone={allInputDone}
                    nextStepHandler={nextStepHandler}
                    value={leaveBehind}
                    changeHandler={leaveBehindHandler}
                    rangeFactor={rangeFactor}
                    min={0}
                    max={500000}
                    pre="Amount"
                    currency={currency}
                    step={1000}
                    post={`in ${endYear + 1}`}
                  />
                }
                right={
                  leaveBehind > 0 ? (
                    <NumberInput
                      name="str"
                      inputOrder={inputOrder + 1}
                      currentOrder={currentOrder}
                      nextStepDisabled={false}
                      allInputDone={allInputDone}
                      nextStepHandler={nextStepHandler}
                      pre="Inheritance"
                      post="Tax Rate"
                      min={0}
                      max={20}
                      step={0.1}
                      value={successionTaxRate}
                      changeHandler={successionTaxRateHandler}
                      unit="%"
                      note={`Total ${toCurrency(
                        Math.round(leaveBehind * (successionTaxRate / 100)),
                        currency
                      )}`}
                    />
                  ) : (
                    !allInputDone && currentOrder === inputOrder + 1 && nextStepHandler()
                  )
                }
                insideForm
              />
    )
}