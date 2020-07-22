import React from 'react'
import { toCurrency, toReadableNumber } from '../utils'
import SVGInfo from '../svginfo'
import {toast} from 'react-toastify'
interface ResultItemProps {
    label: string
    svg?: any
    result: number | string
    noResultFormat?: boolean
    currency?: string
    unit?: string
    footer?: string
    decimal?: number
    titleFormat?: boolean
    info?: string
    pl?: boolean
}

export default function ResultItem(props: ResultItemProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            {props.info && <div className="w-full flex justify-end cursor-pointer" 
                                            onClick={() => toast.info(props.info)}>
                <SVGInfo />
            </div>}
            <label className={props.titleFormat ? "text-xl md:text-2xl font-semibold" : ""}>{props.label}</label>
            <div className="flex justify-center items-center font-semibold">
                {props.svg}
                <div className={`ml-1 ${props.pl ? (props.result > 0 ? 'text-green-600' : 'text-red-600') : ''}`}>
                {typeof(props.result) === 'string' ? `${props.result} ${props.unit ? props.unit : ''}` :
                props.currency ?
                    toCurrency(Math.abs(props.result), props.currency) : props.noResultFormat ? props.result : (toReadableNumber(props.result, props.decimal ? props.decimal : 0) + props.unit)}
                </div>
            </div>
            <label>{props.footer}</label>
        </div>
    )
}