import React, { useEffect, useRef } from 'react'

interface TextInputProps {
    pre: string,
    post?: string,
    value: string,
    width?: string,
    name: string,
    placeholder?: string
    changeHandler: any,
}

export default function TextInput(props: TextInputProps) {
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
            {props.pre && <label>{props.pre}</label>}
            <input className="input" type="text" name={props.name}
                placeholder={props.placeholder} value={props.value} onChange={(e) => props.changeHandler(e.currentTarget.value)}
                required style={{ width: `${props.width}` }} />
            {props.post && <label>{props.post}</label>}
        </form>
    )
}