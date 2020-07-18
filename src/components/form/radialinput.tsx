import React from 'react'
import CircularSlider from '@fseehawer/react-circular-slider'
import NextStep from '../form/nextstep'
interface RadialInputProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    actionCount?: number
    label: string
    data: Array<string>
    width?: number
    changeHandler: Function
    unit?: string
    labelBottom?: boolean
    value: number
    step: number
    pre?: string
    post?: string
}

export default function RadialInput(props: RadialInputProps) {
    const getVal = (str: string) => props.step < 1 ? parseFloat(str) : parseInt(str)
    const width: number = props.width ? props.width : 110

    return (
        <div>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <div className={`flex flex-col items-center justify-center
                                ${!props.allInputDone && props.inputOrder === props.currentOrder ? 'p-2 border-2 border-orange-600' : ''}`}>
                    <label className="mb-1">{props.pre}</label>
                    <CircularSlider onChange={(val: string) => props.changeHandler(props.step < 1 ? parseFloat(val) : parseInt(val))}
                        label={props.label} trackColor="#edf2f7" data={props.data} dataIndex={(props.value - getVal(props.data[0])) / props.step}
                        appendToValue={props.unit} width={width} labelColor="#4a5568" labelBottom={props.labelBottom}
                        valueFontSize="1.25rem" labelFontSize="1.25rem" progressColorFrom="#48bb78"
                        progressColorTo="#48bb78" knobColor="#cbd5e0" />
                    <label className="mt-2">{props.post}</label>
                    {!props.allInputDone && props.inputOrder === props.currentOrder &&
                        <NextStep nextStepHandler={() => props.nextStepHandler(props.actionCount ? props.actionCount : 1)}
                            disabled={props.nextStepDisabled} />}
                </div>}
        </div>
    )
}