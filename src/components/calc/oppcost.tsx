import React, { useState, useEffect } from 'react'
import { getCompoundedIncome } from './finance'
import { toStringArr } from '../utils'
import SVGPiggy from '../svgpiggy'
import RadialInput from '../form/radialinput'
import ResultItem from './resultitem'
interface OppCostProps {
    cfs: Array<number>,
    currency: string,
    startYear: number,
    discountRate: number,
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
        setOppCost(oc)
    }

    useEffect(
        () => {
            calculateOppCost()
        }
        , [props]
    );

    return (
        <div className="flex flex-col items-center w-full justify-center">
            <label className="text-xl md:text-2xl font-semibold">Instead, If You Invest</label>
            <div className="flex justify-around w-full">
                <RadialInput data={toStringArr(2, 15, 0.5)} value={props.discountRate} unit="%"
                    label="Yearly" labelBottom={true} changeHandler={props.discountRateHandler} width={110}
                    post="After-tax Return" step={0.5} colorFrom="#f0fff4" colorTo="#742a2a" />
                <ResultItem svg={<SVGPiggy />} result={oppCost} currency={props.currency} label="You May Get"
                    footer={`In ${props.startYear + props.cfs.length}`} />
            </div>
        </div>
    );
}
