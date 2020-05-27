import React, { useState, useEffect } from 'react';
import SVGTimeCost from './svgtimecost';
import Input from '../input'
import { toReadableNumber, toCurrency } from '../utils';
import SVGPiggy from '../svgpiggy';

interface TimeCostProps {
    amount: number,
    currency: string,
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
        <div className="flex items-center justify-between w-full md:w-1/2 lg:w-1/3 xl:w-1/2">
            <div className="flex flex-col items-center justify-center">
                You Need to Work
            <div className="flex justify-center items-center font-semibold">
                    {timeCostUnit === 'hours' && toReadableNumber(timeCost)}
                    {timeCostUnit === 'weeks' && toReadableNumber(timeCost / props.workHoursPerWeek)}
                    {timeCostUnit === 'years' && toReadableNumber((timeCost / props.workHoursPerWeek / props.annualWorkWeeks), 1)}
                    <select name="savings" className="ml-2 input" value={timeCostUnit} onChange={(e: React.FormEvent<HTMLSelectElement>) => setTimeCostUnit(e.currentTarget.value)}>
                        <option value="hours">hours</option>
                        <option value="weeks">weeks</option>
                        <option value="years">years</option>
                    </select>
                </div>
                <div className="flex">
                    <label>to Save</label>
                    <label className="ml-2 font-semibold">{toCurrency(props.amount, props.currency)}</label>
                </div>
            </div>
            <Input name="savings" pre="Given Yearly" post="Saving of" currency={props.currency} value={annualSavings}
                changeHandler={(e: React.FormEvent<HTMLInputElement>) => setAnnualSavings(e.currentTarget.valueAsNumber)}
                min="100" max="1000000" width="70px" />
        </div>
    );
}
