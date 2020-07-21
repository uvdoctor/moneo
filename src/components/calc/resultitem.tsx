import React from 'react'
import { toCurrency, toReadableNumber } from '../utils'
import SVGInfo from '../svginfo'
import {toast} from 'react-toastify'
interface ResultItemProps {
    label: string
    svg?: any
    result: number
    noResultFormat?: boolean
    currency?: string
    unit?: string
    footer?: string
    decimal?: number
    titleFormat?: boolean
    info?: string
}

export default function ResultItem(props: ResultItemProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            {props.info && <div className="w-full flex justify-end cursor-pointer" 
                                            onClick={() => toast.info(props.info)}>
                <SVGInfo />
            </div>}
            <label className={props.titleFormat ? "text-xl md:text-2xl font-semibold" : ""}>{props.label}</label>
            <div className="flex justify-center items-center">
                {props.svg}
                <label className="ml-1 font-semibold">{props.currency ?
                    toCurrency(props.result, props.currency) : props.noResultFormat ? props.result : (toReadableNumber(props.result, props.decimal ? props.decimal : 0) + props.unit)}
                </label>
            </div>
            <label>{props.footer}</label>
        </div>
    )
}