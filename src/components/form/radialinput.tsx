import React from 'react'
import CircularSlider from '@fseehawer/react-circular-slider'

interface RadialInputProps {
    label: string,
    data: Array<string>,
    width?: number,
    changeHandler: Function,
    unit?: string,
    labelBottom?: boolean,
    float?: boolean,
    value: number,
    step: number,
    pre?: string,
    post?: string
}

export default function RadialInput(props: RadialInputProps) {
    const getVal = (str: string) => props.float ? parseFloat(str) : parseInt(str)
    const width: number = props.width ? props.width : 120

    return (
        <div className="flex flex-col items-center justify-center">
            <label className="mb-1">{props.pre}</label>
            <CircularSlider onChange={(val: string) => props.changeHandler(props.float ? parseFloat(val) : parseInt(val))}
                label={props.label} trackColor="#edf2f7" data={props.data} dataIndex={(props.value - getVal(props.data[0])) / props.step}
                appendToValue={props.unit} width={width} labelColor="#4a5568" labelBottom={props.labelBottom}
                valueFontSize="1.5rem" labelFontSize="1.5rem" progressColorFrom="#48bb78"
                progressColorTo="#48bb78" knobColor="#cbd5e0" />
            <label className="mt-1">{props.post}</label>
        </div>
    )
}