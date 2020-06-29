import React from 'react'
import Slider from 'rc-slider'

interface RangeInputProps {
    min?: number,
    max?: number,
    value: Array<number>,
    changeHandler: any,
    step?: number,
    allowCross?: boolean
}

export default function RangeInput(props: RangeInputProps) {
    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    return (
        <div>
            <p className="text-center">{props.value[0]} to {props.value[1]}</p>
            <Range className="bg-gray-200 rounded-full shadow" min={props.min} max={props.max} step={props.step ? props.step : 1}
                onChange={props.changeHandler} allowCross={props.allowCross}
                value={[props.value[0], props.value[1]]} pushable={5}
                handleStyle={{
                    cursor: "grab",
                    width: "1.2rem",
                    height: "1.2rem",
                    background: "#ffffff",
                    borderRadius: "50%",
                    appearance: "none",
                    border: "none",
                    outline: "none",
                    left: 0,
                    top: 2,
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                }}
                trackStyle={[{
                    backgroundColor: '#48bb78',
                    top: 0,
                    height: '0.9rem'
                }, {
                    backgroundColor: '#48bb78',
                    top: 0,
                    height: '0.9rem'
                }]}
                railStyle={{
                    background: 'none',
                }} />
                <div className="flex justify-between">
                    <label className="text-gray-400">{props.min}</label>
                    <label className="text-gray-400">{props.max}</label>
                </div>
        </div>
    )
}

