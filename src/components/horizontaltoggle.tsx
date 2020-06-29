import React from 'react'
import Slider from 'rc-slider'
interface ToggleProps {
    rightText?: string,
    leftText?: string,
    value: number,
    setter: any,
}

const HToggle = (props: ToggleProps) => {
    return (
        <div className="flex items-center">
            <label className="mr-4">{props.leftText}</label>
            {/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
            <Slider className={`bg-gray-200 rounded-full h-3 w-8`}
                step={1} max={1} value={props.value}
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
                    top: 0,
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                }}
                trackStyle={{
                    backgroundColor: '#48bb78',
                    height: '0.7rem',
                    top: 0
                }}
                railStyle={{
                    background: 'none',
                }} />
            <label className="ml-4">{props.rightText}</label>
        </div>
    )
}

export default HToggle