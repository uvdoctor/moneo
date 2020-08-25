import React, { useRef, useEffect, useState } from 'react'
import { toCurrency, toReadableNumber } from '../utils'
import Slider from 'rc-slider'
import NextStep from './nextstep'
import SVGInfo from '../svginfo'
import { toast } from 'react-toastify'
import { COLORS } from '../../CONSTANTS'

interface NumberInputProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    actionCount?: number
    info?: string
    infoDurationInMs?: number
    pre: string
    post?: string
    min: number
    max: number
    value: number
    width?: string
    name: string
    currency?: string
    rangeFactor?: number
    unit?: string
    changeHandler: any
    note?: any
    step?: number
}


export default function NumberInput(props: NumberInputProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [editing, setEditing] = useState<boolean>(false)
    const width: string = props.width ? props.width : props.currency ? '140px' : props.unit ? '40px' : '70px'
    const [rangeFactor, setRangeFactor] = useState<number>(props.rangeFactor ? props.rangeFactor : 1)

    useEffect(
        () => {
            //@ts-ignore
            if (formRef && formRef.current) formRef.current.reportValidity()
        },
        [formRef]
    );

    useEffect(() => {
        if (props.rangeFactor) setRangeFactor(props.rangeFactor)
        else setRangeFactor(1)
    }, [props.rangeFactor])

    return (
        <div>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <form ref={formRef} className={`${!props.allInputDone && props.inputOrder === props.currentOrder ? 'py-2 px-4 border-2 border-blue-600' : ''}`}>
                    {props.info && <div className="w-full flex justify-end cursor-pointer" onClick={
                        () => toast.info(props.info, {autoClose: props.infoDurationInMs ? props.infoDurationInMs : 5000})}>
                        <SVGInfo />
                    </div>}
                    <div className={props.max ? "w-full flex items-center justify-between" : "w-full flex flex-col justify-between"}>
                        <div className={`w-full flex flex-col mr-1 ${props.max ? "text-left" : "text-right"}`}>
                            {props.pre && <label>{props.pre}</label>}
                            {props.post && <label>{props.post}</label>}
                        </div>
                        <div className="flex justify-end">
                            {!props.currency || (props.currency && editing) ?
                                <input
                                    className="input"
                                    type="number"
                                    name={props.name}
                                    value={props?.value ? props.value : 0}
                                    min={props.min * rangeFactor}
                                    max={props.max * rangeFactor}
                                    step={props.step ? props.step * rangeFactor : 1}
                                    onChange={(e) => props.changeHandler(e.currentTarget.valueAsNumber)}
                                    onBlur={() => setEditing(false)}
                                    required
                                    style={{ textAlign: "right", width: width }}
                                /> :
                                <input className="input"
                                    type="text"
                                    name={props.name}
                                    value={toCurrency(props.value, props.currency)}
                                    onFocus={() => setEditing(true)}
                                    style={{ textAlign: "right", width: width }}
                                    readOnly
                                />
                            }
                        </div>
                        {props.unit && <label className="ml-1 text-right">{props.unit}</label>}
                    </div>
                    {props.max &&
                        <div className="flex flex-col mt-1">
                            {/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
                            <Slider className="bg-gray-200 rounded-full shadow" min={props.min * rangeFactor} max={props.max * rangeFactor} step={props.step * rangeFactor}
                                value={props.value} onChange={props.changeHandler}
                                handleStyle={{
                                    cursor: "grab",
                                    width: "1.2rem",
                                    height: "1.2rem",
                                    background: "#ffffff",
                                    borderRadius: "50%",
                                    appearance: "none",
                                    border: "none",
                                    outline: "none",
                                    left: 0,
                                    top: 2,
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                                }}
                                trackStyle={{
                                    backgroundColor: COLORS.GREEN,
                                    top: 0,
                                    left: 0,
                                    height: '0.9rem'
                                }}
                                railStyle={{
                                    background: 'none',
                                }} />
                            {props.max && <div className="flex justify-between w-full text-gray-400">
                                <label className="mr-2">{toReadableNumber(props.min ? props.min * rangeFactor : 0)}</label>
                                <label>{toReadableNumber(props.max * rangeFactor)}</label>
                            </div>}
                        </div>
                    }
                    <label className="flex justify-center">{props.note}</label>
                    {!props.allInputDone && props.inputOrder === props.currentOrder && 
                    <NextStep nextStepHandler={() => props.nextStepHandler(props.actionCount ? props.actionCount : 1)}
                        disabled={props.nextStepDisabled} />}
                </form>}
        </div>
    )
}