import React from 'react'

interface ToggleProps {
    text: string,
    attr: boolean,
    setter: any
}

const Toggle = (props: ToggleProps) => {
    return (
        <div>
            <label htmlFor="toogleA" className="flex items-center cursor-pointer w-24">
                    <div className="relative">
                        <input checked={props.attr} id="toogleA" type="checkbox" className="hidden" onChange={(e) => props.setter(e.currentTarget.checked)} />
                        <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
                        <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0" />
                    </div>
                    <div className="ml-2">{props.text}</div>
            </label>
        </div>
    )
}

export default Toggle