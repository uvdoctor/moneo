import React, { useState, useEffect } from 'react'
import { getCompoundedIncome } from './finance'
import { toCurrency } from '../utils'
import NumberInput from '../form/numberinput'
import SVGPiggy from '../svgpiggy'
interface OppCostProps {
    cfs: Array<number>,
    currency: string,
    startYear: number
}

export default function OppCost(props: OppCostProps) {
    const [oppCost, setOppCost] = useState<number>(0)
    const [oppDR, setOppDR] = useState<number>(6)

    const calculateOppCost = () => {
        let cfs = props.cfs
        if (!cfs || cfs.length === 0) {
            setOppCost(0)
            return
        }
        let oc: number = cfs.reduce(
            (accumulator, currentValue, index) =>
                accumulator + getCompoundedIncome(oppDR, currentValue, props.cfs.length - index), 0
        )
        setOppCost(oc)
    }

    useEffect(
        () => {
            calculateOppCost()
        }
        , [props, oppDR]
    );

    return (
        <div className="flex justify-around flex-wrap items-center w-full">
            <div className="flex flex-col items-center justify-center">
                <label>You May Get</label>
                <div className="flex justify-center items-center">
                    <SVGPiggy />
                    <label className="ml-2 font-semibold">{toCurrency(oppCost, props.currency)}</label>
                </div>
                <label>{`In ${props.startYear + props.cfs.length}`}</label>
            </div>
            <NumberInput
                name="oppDR"
                pre="Given Yearly"
                post="Return of"
                unit="%"
                width="50px"
                note="after taxes & fees."
                value={oppDR}
                changeHandler={setOppDR}
                min={0}
                max={20}
                step={0.1} />


        </div>
    );
}
