import React, { useState, useEffect } from 'react'
import { getCompoundedIncome } from './finance'
import SVGMoneyBag from './svgmoneybag'
import ResultItem from './resultitem'
import { getExpectedRR } from '../goals/cfutils'
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
    const [netCost, setNetCost] = useState<number>(0)
    const [oppCostCfs, setOppCostCfs] = useState<Array<number>>([])

    const createOppCostCFs = () => {
        let netCost = 0
        let cfs: Array<number> = []
        props.cfs.forEach(cf => {
            netCost += cf
            cfs.push(cf < 0 ? cf : 0)
        })
        setNetCost(netCost)
        setOppCostCfs(cfs)
    }

    useEffect(() => createOppCostCFs(), [props.cfs])

    const calculateOppCost = () => {
        if (!oppCostCfs || oppCostCfs.length === 0) {
            setOppCost(0)
            return
        }
        let potentialEarnings: number = oppCostCfs.reduce(
            (accumulator, currentValue, index) =>
                accumulator + getCompoundedIncome(
                    getExpectedRR(props.startYear + index, props.ffYear, props.ffEndYear, 
                        props.discountRate, props.rrFallDuration), 
                    currentValue, oppCostCfs.length - index), 0)
        setOppCost(potentialEarnings - netCost)
    }

    useEffect(
        () => calculateOppCost()
        , [oppCostCfs, props.discountRate]
    )

    return (
        <ResultItem svg={<SVGMoneyBag />} result={Math.abs(oppCost)} currency={props.currency} label={`You May ${oppCost > 0 ? 'Gain' : 'Lose'}`}
            footer={`Over ${props.cfs.length} Year${props.cfs.length > 1 && 's'}`} />

    )
}
