import React, { Fragment } from 'react'
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
}

export default function ExpandCollapse(props: ExpandCollapseProps) {
    const toggle = () => props.value ? props.handler(false) : props.handler(true)

    return (
        <Fragment>
            {props.titleInfo && <div className="w-full flex justify-end cursor-pointer" onClick={() => toast.info(props.titleInfo)}>
                <SVGInfo />
            </div>}
            <div className="cursor-pointer flex justify-center items-center w-full"
                onClick={toggle}>
                {props.svg}
                <label className="cursor-pointer text-blue-600 ml-2 mr-1 text-lg md:text-xl font-semibold">{props.title}</label>
                <div className="w-1/12">
                    {props.value ? <SVGCollapse /> : <SVGExpand />}
                </div>
            </div>
        </Fragment>
    )
}