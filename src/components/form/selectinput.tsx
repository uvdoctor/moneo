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
        <form ref={formRef} className="flex flex-col mt-4 mr-4">
            {props.pre && <label>{props.pre}</label>}
            <select name={props.name} className="input" value={props.value} onChange={(e) => props.changeHandler(e.currentTarget.value)}>
                {Object.keys(props.options).map(key =>
                    <option key={key} value={key}>
                        {props.options[key]}
                    </option>)}
            </select>
            {props.post && <label>{props.post}</label>}
        </form>
    )
}