import React, { useState, useEffect } from 'react'
import { getCompoundedIncome } from './finance'
import SVGBalance from './svgbalance'
import ResultItem from './resultitem'
import { toCurrency } from '../utils'
interface OppCostProps {
    cfs: Array<number>
    currency: string
    discountRate: Array<number>
    startIndex: number
    buyGoal: boolean
}

export default function OppCost(props: OppCostProps) {
    const [oppCost, setOppCost] = useState<number>(0)

    const calculateOppCost = () => {
        if (!props.cfs || props.cfs.length === 0) {
            setOppCost(0)
            return
        }
        let oppCost = 0
        props.cfs.forEach((cf, index) => {
            oppCost += cf
            if(index < props.cfs.length - 1)
                oppCost = getCompoundedIncome(props.discountRate[props.startIndex + index], oppCost, 1)
        })
        if(!props.buyGoal) {
            for(let i = props.startIndex + props.cfs.length; i < props.discountRate.length; i++) {
                oppCost = getCompoundedIncome(props.discountRate[i], oppCost, 1)
            }
        }
        setOppCost(oppCost)
    }

    useEffect(
        () => calculateOppCost()
        , [props.cfs, props.discountRate]
    )

    return (
        <ResultItem svg={<SVGBalance />} result={oppCost} currency={props.currency} label="Spend v/s Invest" pl
        info={`You May ${oppCost < 0 ? 'Lose' : 'Gain'} ${toCurrency(Math.abs(oppCost), props.currency)} if You Invest this Money instead of ${props.buyGoal ? 'Buying' : 'Spending'}.`} />
    )
}
