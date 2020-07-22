import React, { useEffect, useState } from 'react'
import SVGTimeCost from './svgtimecost'
import ResultItem from './resultitem'
import {toCurrency} from '../utils'
interface TimeCostProps {
    amount: number
    annualSavings: number
    currency: string
}

export default function TimeCost(props: TimeCostProps) {
    const [timeCost, setTimeCost] = useState<number>(0)

    useEffect(() => {
        setTimeCost(props.amount / props.annualSavings)
    }, [props.amount, props.annualSavings])

    return (
        <ResultItem label={`It May Take`} footer={`To Save ${toCurrency(props.amount, props.currency)}`} result={timeCost} 
        unit={` Year${timeCost > 1 ? 's' : ''}`} svg={<SVGTimeCost />} decimal={2} />
    );
}
