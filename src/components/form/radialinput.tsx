import React from 'react'
import CircularSlider from '@fseehawer/react-circular-slider';

interface RadialInputProps {
    label: string,
    min?: number,
    max?: number,
    dataIndex?: number,
    data: Array<string>,
    width?: string,
    changeHandler: any,
    unit?: string
}

export default function RadialInput(props: RadialInputProps) {
    return (
        {/*<CircularSlider onChange={(val: string) => props.changeHandler(parseInt(val))} 
        min={props.min} max={props.max} label={props.label} 
        data={props.data} dataIndex={props.dataIndex} 
    appendToValue={props.unit} />*/}

    )
}