import React from 'react'
import SVGExpand from '../svgexpand'
import SVGCollapse from '../svgcollapse'

interface ExpandCollapseProps {
    title: string,
    value: boolean,
    handler: Function,
    svg?: any
}

export default function ExpandCollapse(props: ExpandCollapseProps) {
    const toggle = () => props.value ? props.handler(false) : props.handler(true)

    return (
        <div className="cursor-pointer flex justify-center items-center mt-4 w-full"
            onClick={toggle}>
            {props.svg}
            <label className="cursor-pointer text-blue-600 ml-4 mr-2 text-lg md:text-xl font-semibold">{props.title}</label>
            <div className="w-1/12">
                {props.value ? <SVGCollapse /> : <SVGExpand />}
            </div>
        </div>
    )
}