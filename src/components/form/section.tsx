import React from 'react'
interface SectionProps {
    title: any,
    left: any,
    right: any,
    bottomLeft?: any,
    bottomRight?: any,
    bottom?: any,
    footer?: string
    toggle?: any
}

export default function Section(props: SectionProps) {
    return (
        <div className="px-1 py-2 mt-4 mb-4 w-full max-w-sm rounded overflow-hidden shadow-xl">
            <p className="text-center text-xl md:text-2xl font-semibold">{props.title}</p>
            {props.toggle && <div className="flex justify-end mt-1 mr-4 mb-4">
                {props.toggle}
            </div>}
            <div className="flex justify-around items-center w-full">
                {props.left}
                {props.right}
            </div>
            {props.bottom && <div className="flex mt-4 items-center justify-center">
                <label className="mr-4">{props.bottomLeft}</label>
                {props.bottom}
                <label className="ml-4">{props.bottomRight}</label>
            </div>}
            {props.footer && <p className="mt-2 text-base text-center">{props.footer}</p>}
        </div>
    )
}