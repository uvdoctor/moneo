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
        <div className="flex flex-col items-center justify-center mr-4 md:mr-8">
            <label className="mb-2">{props.topText}</label>
            <Nouislider id="slider-toggle" className="bg-gray-200 rounded-full" direction="rtl" orientation="vertical" start={props.value} range={{ min: [0, 1], max: 1 }}
                connect={[true, false]}
                onChange={value => props.setter(value[0])} />
                <label className="mt-2">{props.bottomText}</label>
        </div>
    )
}

export default Toggle