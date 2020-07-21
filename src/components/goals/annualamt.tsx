import React, { useState, useEffect, Fragment } from 'react'
import Section from '../form/section'
import RadialInput from '../form/radialinput'
import SelectInput from '../form/selectinput'
import { toStringArr, toCurrency, initYearOptions } from '../utils'
import { calculateTotalAmt } from './cfutils'

interface AnnualAmtProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    startYear: number
    percentage: number
    percentageHandler: Function
    annualSY: number
    annualSYHandler: Function
    currency: string
    title: string
    price: number
    duration: number
    chgRate: number
    footer?: string
}

export default function AnnualAmt(props: AnnualAmtProps) {
    const [syOptions, setSYOptions] = useState<object>(initYearOptions(props.startYear, 10))
    const [totalAmt, setTotalAmt] = useState<number>(0)

    useEffect(() => setSYOptions(initYearOptions(props.startYear, 10)), [props.startYear])

    useEffect(() => setTotalAmt(calculateTotalAmt(props.startYear, props.percentage, props.annualSY, props.price, props.chgRate, props.duration))
        , [props.startYear, props.percentage, props.annualSY, props.price, props.chgRate, props.duration])

    return (
        <Fragment>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <Section title={props.title} insideForm
                    left={
                        <RadialInput inputOrder={props.inputOrder}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone}
                            data={toStringArr(0, 10, 0.2)} changeHandler={props.percentageHandler} width={120}
                            unit="%" labelBottom={true} label="of Amount" post={`Total ${toCurrency(totalAmt, props.currency)}`}
                            value={props.percentage} step={0.2} />
                    } right={
                        <SelectInput inputOrder={props.inputOrder + 1}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone} name="startFrom"
                            pre="From Year" post="Onwards" options={syOptions} value={props.annualSY}
                            changeHandler={props.annualSYHandler} />
                    } footer={props.footer} />}
        </Fragment>
    )
}