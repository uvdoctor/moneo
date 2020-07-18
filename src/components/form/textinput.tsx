import React, { useEffect, useRef } from 'react'
import NextStep from './nextstep';

interface TextInputProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    pre: string
    post?: string
    value: string
    width?: string
    name: string
    placeholder?: string
    changeHandler: Function
}

export default function TextInput(props: TextInputProps) {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => {
            // @ts-ignore: Object is possibly 'null'.
            if (formRef) formRef.current.reportValidity();
        },
        [formRef]
    );

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <form ref={formRef} className={`flex flex-col 
                    ${!props.allInputDone && props.inputOrder === props.currentOrder ? 'p-2 border-2 border-orange-600' : ''}`}>
                    {props.pre && <label>{props.pre}</label>}
                    <input className="input" type="text" name={props.name}
                        placeholder={props.placeholder} value={props.value} onChange={(e) => props.changeHandler(e.currentTarget.value)}
                        required style={{ width: `${props.width}` }} onKeyDown={handleKeyDown} />
                    {props.post && <label>{props.post}</label>}
                    {!props.allInputDone && props.inputOrder === props.currentOrder && <NextStep nextStepHandler={props.nextStepHandler}
                        disabled={props.nextStepDisabled} />}
                </form>}
        </div>
    )
}