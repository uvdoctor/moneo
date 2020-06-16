import React, { useState, useEffect } from 'react';
import NumberInput from '../form/numberinput'
import { toReadableNumber, toCurrency } from '../utils';
import SVGTimeCost from './svgtimecost'

interface TimeCostProps {
    amount: number,
    currency: string,
    annualWorkWeeks: number,
    workHoursPerWeek: number,
    displayFooter: boolean
}

export default function TimeCost(props: TimeCostProps) {
    const [timeCost, setTimeCost] = useState<number>(0)
    const [annualSavings, setAnnualSavings] = useState<number>(20000)
    const [timeCostUnit, setTimeCostUnit] = useState<string>('hours')

    const calculateTimeCost = (props: TimeCostProps, savings: number) => {
        let hours = props.workHoursPerWeek ? props.workHoursPerWeek : 0
        let weeks = props.workHoursPerWeek ? props.annualWorkWeeks : 0
        let amt = props.amount ? props.amount : 0
        if (hours <= 0 || weeks <= 0 || amt <= 0 || savings <= 0) {
            setTimeCost(0)
            return
        }
        setTimeCost((Math.round(amt / (savings / (weeks * hours)))));
    }

    useEffect(() => {
        calculateTimeCost(props, annualSavings)
    }, [props, annualSavings])

    return (
        <div className="flex flex-wrap items-center w-full justify-around">
            <div className="flex flex-col items-center justify-center">
                Your Time Cost is
            <div className="flex items-center justify-between">
                    <SVGTimeCost />
                    <div className="flex ml-2 justify-center items-center font-semibold">
                        {timeCostUnit === 'hours' && toReadableNumber(timeCost)}
                        {timeCostUnit === 'weeks' && toReadableNumber(timeCost / props.workHoursPerWeek)}
                        {timeCostUnit === 'years' && toReadableNumber((timeCost / props.workHoursPerWeek / props.annualWorkWeeks), 1)}
                        <select name="savings" className="ml-2 input" value={timeCostUnit} onChange={(e: React.FormEvent<HTMLSelectElement>) => setTimeCostUnit(e.currentTarget.value)}>
                            <option value="hours">hours</option>
                            <option value="weeks">weeks</option>
                            <option value="years">years</option>
                        </select>
                    </div>

                </div>
                {props.displayFooter && <div className="flex">
                    <label>to Save</label>
                    <label className="ml-2 font-semibold">{toCurrency(props.amount, props.currency)}</label>
                </div>}
            </div>
            <NumberInput name="savings" pre="Given Yearly" post="Savings of" currency={props.currency} value={annualSavings}
                changeHandler={setAnnualSavings}
                min={1000} max={200000} width="100px" />
        </div>
    );
}
