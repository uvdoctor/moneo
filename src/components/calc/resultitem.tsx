import React from 'react'
import { toCurrency, toReadableNumber } from '../utils'

interface ResultItemProps {
    label: string
    svg?: any,
    result: number,
    currency?: string,
    unit?: string,
    footer?: string,
    decimal?: number
}

export default function ResultItem(props: ResultItemProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            <label>{props.label}</label>
            <div className="flex justify-center items-center">
                {props.svg}
                <label className="ml-2 font-semibold">{props.currency ?
                    toCurrency(props.result, props.currency) : (toReadableNumber(props.result, props.decimal ? props.decimal : 0) + props.unit)}
                </label>
            </div>
            <label>{props.footer}</label>
        </div>
    )
}