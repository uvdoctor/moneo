import React, { useState, Fragment } from 'react'
import ExpandCollapse from './expandcollapse'
interface SectionProps {
    title: any
    left: any
    right: any
    bottomLeft?: any
    bottomRight?: any
    bottom?: any
    footer?: any
    toggle?: any
    inputText?: string
    showInputCondition?: any
    showOnLoad?: boolean
}

export default function Section(props: SectionProps) {
    const [showSection, setShowSection] = useState<boolean>(props.showOnLoad ? props.showOnLoad : false)

    return (
        <div className={`px-1 py-2 mt-4 mb-4 w-full max-w-sm rounded overflow-hidden 
                        shadow-lg md:shadow-xl ${props.inputText && props.showInputCondition ? 'border-2 border-orange-600' : ''}`}>
            <ExpandCollapse title={props.inputText && props.showInputCondition ? props.inputText : props.title} value={showSection} 
                handler={setShowSection} />
            {props.toggle && showSection && <div className="flex justify-end mr-4 mb-4">
                {props.toggle}
            </div>}
            {showSection && <Fragment>
                <div className="mt-2 flex flex-col md:flex-row justify-around items-center w-full">
                    {props.left}
                    {props.right && <div className="mt-4 md:mt-0">
                        {props.right}
                    </div>}
                </div>
                {props.bottom && <div className="flex mt-4 items-center justify-center">
                    <label className="mr-4">{props.bottomLeft}</label>
                    {props.bottom}
                    <label className="ml-4">{props.bottomRight}</label>
                </div>}
                {props.footer && <div className="mt-2 flex justify-center text-base">{props.footer}</div>}
            </Fragment>}
        </div>
    )
}