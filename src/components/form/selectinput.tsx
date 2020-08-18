import React, { Fragment } from 'react'
import NextStep from './nextstep'
import { getCurrencyList } from '../utils'
import SVGInfo from '../svginfo'
import { toast } from 'react-toastify'
interface SelectInputProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    actionCount?: number
    disabled?: boolean
    info?: string
    pre: string
    post?: string
    options?: any
    value: string | number
    name: string
    unit?: string
    changeHandler: any
    currency?: boolean
}

export default function SelectInput(props: SelectInputProps) {
    return (
        <div>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <div className={`flex flex-col
                ${!props.allInputDone && props.inputOrder === props.currentOrder ? 'p-2 border-2 border-blue-600' : ''}`}>
                    {props.info && <div className="w-full flex justify-end cursor-pointer" onClick={() => toast.info(props.info)}>
                        <SVGInfo />
                    </div>}
                    {props.pre && <label>{props.pre}</label>}
                    {!props.disabled ?
                        <Fragment>
                            <select name={props.name} className="input" value={props.value} onChange={(e) => props.changeHandler(e.currentTarget.value)}>
                                {Object.keys(props.currency ? getCurrencyList() : props.options).map(key =>
                                    <option key={key} value={key}>
                                        {props.currency ? key : props.options[key]}
                                    </option>)}
                            </select>
                            {props.post && <label>{props.post}</label>}
                        </Fragment> :
                        <label>{props.value}</label>}
                    {!props.allInputDone && props.inputOrder === props.currentOrder && <NextStep
                        nextStepHandler={() => props.nextStepHandler(props.actionCount ? props.actionCount : 1)}
                        disabled={props.nextStepDisabled} />}
                </div>}
        </div>
    )
}