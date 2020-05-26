import React, { useState, useEffect } from 'react';
import SVGTimeCost from './svgtimecost';
import Input from '../input'
import { getTimeCostUnits, toReadableNumber } from '../utils';
import SVGInfo from '../info';

interface TimeCostProps {
    amount: number,
    annualWorkWeeks: number,
    workHoursPerWeek: number
}

export default function TimeCost(props: TimeCostProps) {
    const [timeCost, setTimeCost] = useState<number>(0)
    const [annualSavings, setAnnualSavings] = useState<number>(20000)
    const [timeCostUnit, setTimeCostUnit] = useState<string>('hours')

    const calculateTimeCost = (props: TimeCostProps, savings: number) => {
        let hours = props.workHoursPerWeek ? props.workHoursPerWeek : 0
        let weeks = props.workHoursPerWeek ? props.annualWorkWeeks : 0
        let amt = props.amount ? props.amount : 0
        if (hours <= 0 || weeks <= 0 || amt <= 0 || savings <= 0) return
        setTimeCost((Math.round(amt / (savings / (weeks * hours)))));
    }

    useEffect(() => {
        calculateTimeCost(props, annualSavings)
    }, [props, annualSavings])

    return (
        <div className="flex font-bold items-center">
            <SVGTimeCost />
            <div className="flex flex-col px-2">
                {timeCostUnit === 'hours' && toReadableNumber(timeCost)}
                {timeCostUnit === 'weeks' && toReadableNumber(timeCost / props.workHoursPerWeek)}
                {timeCostUnit === 'years' && toReadableNumber((timeCost / props.workHoursPerWeek / props.annualWorkWeeks), 1)}
                <Input name="tcunit" value={timeCostUnit}
                    changeHandler={(e: React.FormEvent<HTMLSelectElement>) => setTimeCostUnit(e.currentTarget.value)}
                    options={getTimeCostUnits()} />
            </div>
            <Input name="savings" pre="Annual Savings" value={annualSavings}
            changeHandler = {(e: React.FormEvent<HTMLInputElement>) => setAnnualSavings(e.currentTarget.valueAsNumber)}
            min="100" max="1000000" width="70px" />
            <SVGInfo />
        </div>
    );
}
