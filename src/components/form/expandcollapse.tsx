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
        <div className="cursor-pointer flex justify-center items-center mt-4 md:mt-8"
            onClick={toggle}>
            {props.svg}    
            <label className="ml-4 mr-2 text-xl md:text-2xl font-semibold">{props.title}</label>
            {props.value ? <SVGCollapse /> : <SVGExpand />}
        </div>
    )
}