import React, { useState, useEffect, Fragment } from 'react'
import { getCompoundedIncome } from './finance'
import { toCurrency, initYearOptions } from '../utils'
import NumberInput from '../form/numberinput'
import SelectInput from '../form/selectinput'
import * as APIt from '../../api/goals'

interface OppCostProps {
    targets: Array<APIt.TargetInput>,
    currency: string,
    startYear: number,
    endYear: number
}

export default function OppCost(props: OppCostProps) {
    const getAnnualCFs = (targets: Array<APIt.TargetInput>) => {
        let cfs: Array<number> = []
        targets.map((target) => cfs.push(target.val))
        return cfs
    }

    const [oppCost, setOppCost] = useState<number>(0)
    const [oppEndYear, setOppEndYear] = useState<number>(props.startYear + 20)
    const [oppDR, setOppDR] = useState<number>(6)

    const calculateOppCost = (targets: Array<APIt.TargetInput>, oppDR: number, oppYears: number) => {
        let cfs = getAnnualCFs(targets)
        if (!cfs || cfs.length === 0 || oppDR <= 0 || oppYears <= 0) {
            setOppCost(0)
            return
        }
        let oc: number = cfs.reduce(
            (accumulator, currentValue, index) =>
                accumulator + getCompoundedIncome(oppDR, currentValue, oppYears - index), 0
        )
        setOppCost(oc)
    }

    useEffect(
        () => {
            calculateOppCost(props.targets, oppDR, oppEndYear - props.startYear)
        }
        , [props, oppDR, oppEndYear]
    );

    const changeEndYear = (ey: string) => {
        let endYear = parseInt(ey)
        setOppEndYear(endYear)
        calculateOppCost(props.targets, oppDR, endYear - props.startYear)
    }

    return (
        <div className="flex w-full flex-wrap items-center">
            <div className="flex flex-col justify-center items-center mr-8 md:mr-12"><label>You Can Earn</label>
                <label className="font-semibold">{toCurrency(oppCost, props.currency)}</label>
                <label>If You Invest Instead</label></div>
            <SelectInput
                name="OppYears"
                pre={`From ${props.startYear} To`}
                options={initYearOptions(props.endYear + 1, 50)}
                value={oppEndYear}
                changeHandler={changeEndYear}
            />
            <div className="ml-8 md:ml-12">
                <NumberInput
                    name="oppDR"
                    pre="Given Yearly"
                    post="Return of"
                    unit="%"
                    width="30px"
                    value={oppDR}
                    changeHandler={setOppDR}
                    min={1}
                    max={20} /></div>
        </div>
    );
}
