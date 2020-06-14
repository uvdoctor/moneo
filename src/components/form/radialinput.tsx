import React from 'react'
import CircularSlider from '@fseehawer/react-circular-slider'

interface RadialInputProps {
    label: string,
    min?: number,
    max?: number,
    dataIndex?: number,
    data: Array<string>,
    width?: number,
    changeHandler: Function,
    unit?: string,
    labelBottom?: boolean,
    float?: boolean
}

export default function RadialInput(props: RadialInputProps) {
    return (
        <CircularSlider onChange={(val: string) => props.changeHandler(props.float ? parseFloat(val) : parseInt(val))}
            label={props.label} trackColor="#edf2f7" data={props.data} dataIndex={props.dataIndex}
            appendToValue={props.unit} width={props.width} labelColor="#4a5568" labelBottom={props.labelBottom}
            valueFontSize="1.5rem" labelFontSize="1.5rem" progressColorFrom="#48bb78" progressColorTo="#48bb78" knobColor="#cbd5e0"
        />

    )
}