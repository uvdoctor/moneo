import React, { useRef, useEffect, useState } from 'react'
import { toCurrency, toReadableNumber } from '../utils'
import CurrencyInput from './currencyinput'
import Slider from 'rc-slider'
interface NumberInputProps {
    pre: string,
    post?: string,
    min?: number,
    max?: number,
    value: number,
    width?: string,
    name: string,
    currency?: string,
    currencyHandler?: any,
    unit?: string,
    changeHandler: any,
    note?: string,
    step?: number
}


export default function NumberInput(props: NumberInputProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [editing, setEditing] = useState<boolean>(false)
    const width: string = props.width ? props.width: props.currency ? '140px' : props.unit ? '40px' : '70px'

    useEffect(
        () => {
            // @ts-ignore: Object is possibly 'null'.
            formRef.current.reportValidity()
        },
        [formRef]
    );

    return (
        <form ref={formRef}>
            <div className={props.max ? "w-full flex items-center justify-between" : "w-full flex flex-col justify-between"}>
                <div className={props.max ? "w-full flex flex-col text-left mr-1" : "w-full flex flex-col text-right mr-1"}>
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
                            min={props.min}
                            max={props.max}
                            step={props.step ? props.step : 1}
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
                {props.currencyHandler &&
                    <div className={props.min && props.max ? "text-left" : "text-right"}>
                        <CurrencyInput name="currList" value={props.currency as string} changeHandler={props.currencyHandler} />
                    </div>}
            </div>
            {props.max &&
                <div className="flex flex-col mt-1">
                    {/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
                    <Slider className="bg-gray-200 rounded-full shadow" min={props.min} max={props.max} step={props.step}
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
                            backgroundColor: '#48bb78',
                            top: 0,
                            left: 0,
                            height: '0.9rem'
                        }}
                        railStyle={{
                            background: 'none',
                        }} />
                    {props.max && <div className="flex justify-between w-full text-gray-400">
                        <label className="mr-2">{toReadableNumber(props.min ? props.min : 0)}</label>
                        <label>{toReadableNumber(props.max)}</label>
                    </div>}
                </div>
            }
            <label className="flex justify-center">{props.note}</label>
        </form >
    );
}