import React, { useRef, useEffect, useState } from 'react'
import { toCurrency } from '../utils'
import CurrencyInput from './currencyinput'
import Slider from 'rc-slider'
interface NumberInputProps {
    pre: string,
    post?: string,
    min?: number,
    max?: number,
    value?: number,
    width?: string,
    name: string,
    currency?: string,
    currencyHandler?: any,
    unit?: string,
    changeHandler: any,
    note?: string,
    orientation?: string,
    step?: number
}


export default function NumberInput(props: NumberInputProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [editing, setEditing] = useState<boolean>(false)
    const defaultWidth = '70px'

    useEffect(
        () => {
            // @ts-ignore: Object is possibly 'null'.
            formRef.current.reportValidity()
        },
        [formRef]
    );

    return (
        <form ref={formRef} className="mr-4 md:mr-8">
            <div className={props.max ? "flex items-center justify-between" : "flex flex-col justify-between"}>
                <ul className={props.max ? "text-left" : "text-right"}>
                    {props.pre && <li>{props.pre}</li>}
                    {props.post && <li>{props.post}</li>}
                </ul>
                <div className="flex justify-end">
                    {console.log("Props.currency: ", props.currency)}
                    {!props.currency || (props.currency && editing) ?
                        <input
                            className="input"
                            type="number"
                            name={props.name}
                            value={props.value}
                            min={props.min}
                            max={props.max}
                            step={props.step ? props.step : 1}
                            onChange={(e) => props.changeHandler(e.currentTarget.valueAsNumber)}
                            onBlur={() => setEditing(false)}
                            required
                            style={{ textAlign: "right", width: `${props.width ? props.width : defaultWidth}` }}
                        /> :
                        <input className="input"
                            type="text"
                            name={props.name}
                            value={toCurrency(props.value, props.currency)}
                            onFocus={() => setEditing(true)}
                            style={{ textAlign: "right", width: `${props.width ? props.width : defaultWidth}` }}
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
                            cursor: "pointer",
                            width: "1.2rem",
                            height: "1.2rem",
                            background: "#ffffff",
                            borderRadius: "50%",
                            webkitAppearance: "none",
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
                            height:'0.9rem'
                        }}
                        railStyle={{
                            background: 'none',
                        }} />
                    <div className="flex justify-between w-full text-gray-400">
                        <label>{props.min ? props.min: 0}</label>
                        <label>{props.max}</label>
                    </div>
                </div>
            }
            <label className="flex justify-center">{props.note}</label>
        </form >
    );
}