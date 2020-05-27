import React, { useEffect, useRef } from 'react'

interface SelectInputProps {
    pre: string,
    post?: string,
    options: any,
    value: string | number,
    name: string,
    unit?: string,
    changeHandler: any,
}

export default function SelectInput(props: SelectInputProps) {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => {
            // @ts-ignore: Object is possibly 'null'.
            formRef.current.reportValidity();
        },
        [formRef]
    );

    return (
        <form ref={formRef} className="flex flex-col">
            <div className="flex flex-col">
                {props.pre && <label>{props.pre}</label>}
                {props.post && <label>{props.post}</label>}
            </div>
            <select name={props.name} className="input" value={props.value} onChange={props.changeHandler}>
                {Object.keys(props.options).map(key =>
                    <option key={key} value={key}>
                        {props.options[key]}
                    </option>)}
            </select>
        </form>
    )
}