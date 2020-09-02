import React from 'react'
import SVGExpand from '../svgexpand'
import SVGCollapse from '../svgcollapse'
import SVGInfo from '../svginfo'
import { toast } from 'react-toastify'
interface ExpandCollapseProps {
    title: string
    titleInfo?: string
    value: boolean
    handler: Function
    svg?: any
    insideForm?: boolean
}

export default function ExpandCollapse(props: ExpandCollapseProps) {
    const toggle = () => props.value ? props.handler(false) : props.handler(true)

    return (
        <div className={`w-full ${props.insideForm && 'bg-black text-white py-1'}`}>
            {props.titleInfo && <div className="w-full flex justify-center cursor-pointer" onClick={() => toast.info(props.titleInfo)}>
                <SVGInfo />
            </div>}
            <div className="cursor-pointer flex justify-center items-center w-full"
                onClick={toggle}>
                {props.svg}
                <label className="pl-2 pr-1 cursor-pointer">{props.title}</label>
                <div className="w-1/12 cursor-pointer">
                    {props.value ? <SVGCollapse /> : <SVGExpand />}
                </div>
            </div>
        </div>
    )
}