import React from 'react'
import { getCurrencyList } from '../utils';
interface CurrencyInputProps {
    value: string | number,
    name: string,
    changeHandler: any,
}

export default function CurrencyInput(props: CurrencyInputProps) {
    const options = getCurrencyList();

    return (
        <select name={props.name} className="input" value={props.value} onChange={(e: React.FormEvent<HTMLSelectElement>) => props.changeHandler(e.currentTarget.value)}>
            {Object.keys(options).map(key =>
                <option key={key} value={key}>
                    {key}
                </option>)}
        </select>
    )
}