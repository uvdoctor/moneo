import React, { useState, useEffect } from 'react'
import Section from '../form/section'
import RadialInput from '../form/radialinput'
import SelectInput from '../form/selectinput'
import { toStringArr, toCurrency, initYearOptions } from '../utils'
import { calculateTotalAmt } from './cfutils'

interface AnnualAmtProps {
    startYear: number
    percentage: number
    percentageHandler: Function
    annualSY: number
    annualSYHandler: Function
    currency: string
    title: string
    price: number
    duration: number
    buyTaxRate: number
    chgRate: number
    footer?: string
}

export default function AnnualAmt(props: AnnualAmtProps) {
    const [syOptions, setSYOptions] = useState<object>(initYearOptions(props.startYear, 10))
    const [totalAmt, setTotalAmt] = useState<number>(0)

    useEffect(() => setSYOptions(initYearOptions(props.startYear, 10)), [props.startYear])

    useEffect(() => setTotalAmt(calculateTotalAmt(props.startYear, props.buyTaxRate,
        props.percentage, props.annualSY, props.price, props.chgRate, props.duration))
    , [props.startYear, props.buyTaxRate, props.percentage, props.annualSY, props.price, props.chgRate, props.duration])

    return (
        <Section title={props.title} showOnLoad={true}
            left={
                <RadialInput data={toStringArr(0, 10, 0.1)} float={true} changeHandler={props.percentageHandler} width={120}
                    unit="%" labelBottom={true} label="of Price" post={`Total ${toCurrency(totalAmt, props.currency)}`} value={props.percentage} step={0.1} />
            } right={
                <SelectInput name="startFrom" pre="Starting" options={syOptions} value={props.annualSY}
                    changeHandler={props.annualSYHandler} />
            } footer={props.footer} />
    )
}