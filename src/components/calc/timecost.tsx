import React, { useEffect, useState } from 'react'
import SVGTimeCost from './svgtimecost'
import ItemDisplay from './ItemDisplay'
import {toCurrency} from '../utils'
interface TimeCostProps {
    cfs: Array<number>
    annualSavings: number
    currency: string
}

export default function TimeCost(props: TimeCostProps) {
    const [timeCost, setTimeCost] = useState<number>(0)

    useEffect(() => {
        let netAmt = 0
        props.cfs.forEach(cf => netAmt += cf)
        setTimeCost(netAmt / props.annualSavings)
    }, [props.cfs, props.annualSavings])

    return (
        <ItemDisplay label='' result={timeCost} 
        unit={` Year${timeCost > 1 ? 's' : ''}`} svg={<SVGTimeCost />} decimal={2} 
        info={`Number of Years it takes to save the Net Amount for this Goal considering Annual Savings of ${toCurrency(props.annualSavings, props.currency)} in ${new Date().getFullYear()}.`} />
    );
}
