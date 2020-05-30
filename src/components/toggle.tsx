import React from 'react'
import Nouislider from 'nouislider-react'

interface ToggleProps {
    topText?: string,
    bottomText?: string,
    value: number,
    setter: any
}

const Toggle = (props: ToggleProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {/**<label htmlFor="toogleA" className="flex items-center cursor-pointer w-24">
                    <div className="relative">
                        <input checked={props.attr} id="toogleA" type="checkbox" className="hidden" onChange={(e) => props.setter(e.currentTarget.checked)} />
                        <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
                        <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0" />
                    </div>
                    <div className="ml-2">{props.text}</div>
    </label>**/}
            <label className="m-2">{props.topText}</label>
            <Nouislider id="slider-toggle" className="bg-gray-200 rounded-full" direction="rtl" orientation="vertical" start={props.value} range={{ min: [0, 1], max: 1 }}
                connect={[true, false]}
                onChange={value => props.setter(value[0])} />
                <label className="m-2">{props.bottomText}</label>
        </div>
    )
}

export default Toggle