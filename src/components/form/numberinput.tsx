import React, { useRef, useEffect, useState } from 'react'
import { toCurrency } from '../utils'
import CurrencyInput from './currencyinput';

interface NumberInputProps {
    pre: string,
    post?: string,
    min?: string,
    max?: string,
    value?: number,
    width?: string,
    float?: string,
    name: string,
    currency?: string,
    currencyHandler?: any,
    unit?: string,
    changeHandler: any
}


export default function NumberInput(props: NumberInputProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [editing, setEditing] = useState<boolean>(false)
    const defaultWidth = '70px'

    useEffect(
        () => {
            // @ts-ignore: Object is possibly 'null'.
            formRef.current.reportValidity();
        },
        [formRef]
    );

    return (
        <form ref={formRef}>
            <div className={props.min && props.max ? "flex items-center justify-between" : "flex flex-col justify-between"}>
                <ul className={props.min && props.max ? "text-left" : "text-right"}>
                    {props.pre && <li>{props.pre}</li>}
                    {props.post && <li>{props.post}</li>}
                </ul>
                <div className="flex justify-end ml-4">
                    {!props.currency || (props.currency && editing) ?
                        <input
                            className="input"
                            type="number"
                            name={props.name}
                            value={props.value}
                            min={props.min}
                            max={props.max}
                            step={props.float ? props.float : "1"}
                            onChange={props.changeHandler}
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
                    <div className="ml-2">
                        <CurrencyInput name="currList" value={props.currency as string} changeHandler={props.currencyHandler} />
                    </div>}
            </div>
            {props.min && props.max &&
                <div className="flex flex-col mt-1">
                    <input className="rounded-lg overflow-hidden appearance-none bg-gray-400 h-3 md:h-4 w-full cursor-default outline-none focus:outline-none shadow focus:shadow-lg" type="range" min={props.min} max={props.max} step={props.float ? props.float : "1"} value={`${props.value}`}
                        onChange={props.changeHandler} />
                    <div className="flex justify-between w-full text-gray-400">
                        <label>{props.min}</label>
                        <label>{props.max}</label>
                    </div>
                </div>
            }
        </form >
    );
}