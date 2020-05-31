import React, { useRef, useEffect, useState } from 'react'
import { toCurrency } from '../utils'
import CurrencyInput from './currencyinput'
import Nouislider from "nouislider-react"
import wnumb from "wnumb"

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
    const [sliderRef, setSliderRef] = useState(null)
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
        <form ref={formRef} className="mt-4 mr-4">
            <div className={props.min && props.max ? "flex items-center justify-between" : "flex flex-col justify-between"}>
                <ul className={props.min && props.max ? "text-left" : "text-right"}>
                    {props.pre && <li>{props.pre}</li>}
                    {props.post && <li>{props.post}</li>}
                </ul>
                <div className="flex justify-end">
                    {!props.currency || (props.currency && editing) ?
                        <input
                            className="input"
                            type="number"
                            name={props.name}
                            value={props.value}
                            min={props.min}
                            max={props.max}
                            onChange={(e) => {
                                // @ts-ignore: Object is possibly 'null'.
                                if(sliderRef && sliderRef.noUiSlider) sliderRef.noUiSlider.set(e.currentTarget.valueAsNumber)
                                props.changeHandler(e.currentTarget.valueAsNumber)
                            }}
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
                        <CurrencyInput name="currList" value={props.currency as string} changeHandler={(e: React.FormEvent<HTMLSelectElement>) => props.currencyHandler(e.currentTarget.value)} />
                    </div>}
            </div>
            {props.min && props.max &&
                <div className="flex flex-col mt-1">
                    {/*<input className="rounded-lg overflow-hidden appearance-none bg-gray-400 h-3 md:h-4 w-full cursor-default outline-none focus:outline-none shadow focus:shadow-lg" 
                    type="range" min={props.min} max={props.max} step={props.float ? props.float : "1"} value={props.value}
            onChange={props.changeHandler} />*/}
                    <Nouislider className="rounded-full" tooltips={true}
                    instanceRef = {
                        instance => {
                            if(instance && !sliderRef) setSliderRef(instance as any)
                        }
                    }
                    format={wnumb({decimals: (props.step && props.step < 1) ? 2 : 0})}
                    range={{ min: [props.min], max: [props.max]}} start={[props.value as number]} step={props.step ? props.step : 1} connect={[true, false]}
                    onChange={values => props.changeHandler(values[0] as number)}
                    orientation={props.orientation ? "vertical" : "horizontal"} />    
                    <div className="flex justify-between w-full text-gray-400">
                        <label>{props.min}</label>
                        <label>{props.max}</label>
                    </div>
                </div>
            }
            <label className="text-center">{props.note}</label>
        </form >
    );
}