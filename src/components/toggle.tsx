import React from 'react'
import Slider from 'rc-slider'
import { COLORS } from '../CONSTANTS'
interface ToggleProps {
    topText?: string,
    bottomText?: string,
    value: number,
    setter: any
}

const Toggle = (props: ToggleProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <label className="mb-2">{props.topText}</label>
            {/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
            <Slider className={`bg-gray-200 rounded-full h-10 w-3 left-0`}
                step={1} max={1} vertical value={props.value}
                onChange={props.setter}
                handleStyle={{
                    cursor: "pointer",
                    width: "1.2rem",
                    height: "1.2rem",
                    background: "#ffffff",
                    borderRadius: "50%",
                    appearance: "none",
                    border: "none",
                    outline: "none",
                    left: 1.5,
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                }}
                trackStyle={{
                    backgroundColor: COLORS.GREEN,
                    width: '0.75rem',
                    left: 0
                }}
                railStyle={{
                    background: 'none',
                }} />
            <label className="mt-2">{props.bottomText}</label>

        </div>
    )
}

export default Toggle