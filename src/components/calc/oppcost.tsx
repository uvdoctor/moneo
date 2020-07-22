import React, { useState, useEffect } from 'react'
import { getCompoundedIncome } from './finance'
import SVGBalance from './svgbalance'
import ResultItem from './resultitem'
import { getExpectedRR } from '../goals/cfutils'
import { toCurrency } from '../utils'
interface OppCostProps {
    cfs: Array<number>
    currency: string
    discountRate: number
    rrFallDuration: number
    ffYear: number | null
    ffEndYear: number
    startYear: number
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
            let expectedRR = getExpectedRR(props.startYear + index, props.ffYear, props.ffEndYear, 
                props.discountRate, props.rrFallDuration)
            oppCost += cf
            if(index < props.cfs.length - 1)
                oppCost = getCompoundedIncome(expectedRR, oppCost, 1)
        })
        setOppCost(oppCost)
    }

    useEffect(
        () => calculateOppCost()
        , [props.cfs, props.discountRate]
    )

    return (
        <ResultItem svg={<SVGBalance />} result={oppCost} currency={props.currency} label="Spend v/s Invest" pl
        info={`You May ${oppCost < 0 ? 'Lose' : 'Gain'} ${toCurrency(Math.abs(oppCost), props.currency)} by Spending for this Goal instead of Investing.`} />
    )
}
