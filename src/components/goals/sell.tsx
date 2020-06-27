import React, { useState, useEffect } from 'react'
import ResultItem from '../calc/resultitem'
import SVGMoneyBag from '../calc/svgmoneybag'
import Section from '../form/section'
import RadialInput from '../form/radialinput'
import NumberInput from '../form/numberinput'
import { toStringArr } from '../utils'
import { calculateSellPrice, calculateXIRR } from './cfutils'
import { getDuration } from './goalutils'
import { GoalType } from '../../api/goals'

interface SellProps {
    type: GoalType
    price: number,
    buyTaxRate: number,
    startYear: number,
    endYear: number,
    sellAfter: number,
    sellPrice: number,
    sellPriceHandler: Function,
    sellAfterHandler: Function,
    currency: string,
    assetChgRate: number,
    assetChgRateHandler: Function,
    cfs: Array<number>
}

export default function Sell(props: SellProps) {
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    
    useEffect(() => {
        let duration = getDuration(props.type, props.sellAfter, props.startYear, props.endYear)
        let sellPrice = calculateSellPrice(props.price, props.buyTaxRate, props.assetChgRate, duration)
        props.sellPriceHandler(sellPrice)
        setAnnualReturnPer(calculateXIRR(props.cfs, props.startYear, props.price, props.sellAfter, props.sellPrice))
    }, [props.currency, props.cfs])

    return (
        <Section title="Sell After" left={
            <RadialInput width={120} label="Years" labelBottom={true} data={toStringArr(1, 20)}
                value={props.sellAfter} step={1} changeHandler={props.sellAfterHandler} />
        } right={
            <ResultItem svg={<SVGMoneyBag />} label={`In ${props.startYear + props.sellAfter} for`}
                result={Math.round(props.sellPrice)} currency={props.currency}
                footer={annualReturnPer ? `${annualReturnPer.toFixed(2)}% Yearly ${annualReturnPer > 0 ? 'Gain' : 'Loss'}` : ''} />
        } bottomLeft="Assume" bottomRight="Yearly"
            bottom={
                <NumberInput name="assetChgRate" pre="Sell Price" post="Changes" unit="%"
                    width="30px" min={-20} max={20} step={0.5} value={props.assetChgRate} changeHandler={props.assetChgRateHandler} />
            } footer='Amount after paying taxes & fees.' />

    )
}