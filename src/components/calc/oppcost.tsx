import React, { useState, useEffect } from 'react'
import { getCompoundedIncome } from './finance'
import { toStringArr } from '../utils'
import SVGMoneyBag from './svgmoneybag'
import RadialInput from '../form/radialinput'
import ResultItem from './resultitem'
import Section from '../form/section'

interface OppCostProps {
    cfs: Array<number>,
    currency: string,
    startYear: number,
    discountRate: number,
    duration: number,
    discountRateHandler: Function
}

export default function OppCost(props: OppCostProps) {
    const [oppCost, setOppCost] = useState<number>(0)

    const calculateOppCost = () => {
        let cfs = props.cfs
        if (!cfs || cfs.length === 0) {
            setOppCost(0)
            return
        }
        let oc: number = cfs.reduce(
            (accumulator, currentValue, index) =>
                accumulator + getCompoundedIncome(props.discountRate, currentValue, props.cfs.length - index), 0
        )
        setOppCost(Math.abs(oc))
    }

    useEffect(
        () => {
            calculateOppCost()
        }
        , [props]
    );

    return (
        <Section title="Instead, If You Invest"
            left={
                <RadialInput data={toStringArr(2, 15, 0.5)} value={props.discountRate} unit="%"
                    label="Yearly" labelBottom={true} changeHandler={props.discountRateHandler} 
                    post="After-tax Return" step={0.5} />
            }
            right={
                <ResultItem svg={<SVGMoneyBag />} result={oppCost} currency={props.currency} label="You May Get"
                    footer={`In ${props.startYear + props.duration}`} />
            } />
    )
}
