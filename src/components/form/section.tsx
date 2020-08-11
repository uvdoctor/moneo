import React, { useState, Fragment } from 'react'
import ExpandCollapse from './expandcollapse'
interface SectionProps {
    title: any
    titleInfo?: string
    left: any
    right?: any
    bottomLeft?: any
    bottomRight?: any
    bottom?: any
    footer?: any
    toggle?: any
    showOnLoad?: boolean
    manualInput?: any
    manualMode?: number
    hasResult?: boolean
    insideForm?: boolean
}

export default function Section(props: SectionProps) {
    const [showSection, setShowSection] = useState<boolean>(props.showOnLoad ? props.showOnLoad : true)

    return (
        <div className='ml-1 mr-1 mt-2 mb-4 w-full max-w-sm md:max-w-md rounded overflow-hidden 
                        shadow-lg md:shadow-xl'>
            <ExpandCollapse title={props.title} value={showSection}
                handler={setShowSection} titleInfo={props.titleInfo} insideForm={props.insideForm} />
            {props.toggle && showSection && <div className="flex justify-end mt-2 mr-4">
                {props.toggle}
            </div>}
            {showSection && <Fragment>
                {props.manualMode && props.manualMode > 0 ? props.manualInput
                    : <Fragment>
                        <div className="pt-2 flex flex-wrap justify-around items-start w-full">
                            <div className={`${props.hasResult && 'w-full'}`}>
                                {props.left}
                            </div>
                            {props.right && <div className="mt-2 md:mt-0">
                                {props.right}
                            </div>}
                        </div>
                        {props.bottom && <div className="flex flex-wrap mt-2 items-center justify-center">
                            <label className="mr-4">{props.bottomLeft}</label>
                            {props.bottom}
                            <label className="ml-4">{props.bottomRight}</label>
                        </div>}
                        {props.footer && <div className="mt-2 flex justify-center text-base">{props.footer}</div>}
                    </Fragment>}
            </Fragment>}
        </div>
    )
}