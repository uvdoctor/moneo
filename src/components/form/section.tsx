import React from 'react'

interface SectionProps {
    title: any,
    left: any,
    right: any,
    bottomLeft?: string,
    bottomRight?: string,
    bottom?: any,
    toggle1?: any,
    toggle2?: any,
    footer?: string
}
export default function Section(props: SectionProps) {
    return (
        <div className="px-1 py-2 mt-4 mb-4 flex flex-col items-center w-full md:w-1/2 justify-around max-w-sm rounded overflow-hidden shadow-xl">
            <div className="w-full p-4 flex items-center justify-center">
                <div className="text-xl md:text-2xl font-semibold">{props.title}</div>
                <div className="ml-4 mr-4">{props.toggle1}</div>
                {props.toggle2}
            </div>
            <div className="flex justify-around items-center w-full">
                {props.left}
                {props.right}
            </div>
            <div className="flex mt-4 items-center justify-center">
                <label className="mr-4">{props.bottomLeft}</label>
                {props.bottom}
                <label className="ml-4">{props.bottomRight}</label>
            </div>
            <p className="mt-2 text-base">{props.footer}</p>
        </div>
    )
}