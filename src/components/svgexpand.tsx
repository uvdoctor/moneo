import React from 'react'
import { COLORS } from '../CONSTANTS'

interface SVGExpandProps {
    color?: string
    animate?: boolean
}

export default function SVGExpand({color, animate}: SVGExpandProps) {
    return (
        <svg className={`w-6 cursor-pointer ${animate && 'animate-bounce'}`} viewBox="0 0 24 24">
            <path fill={color ? color : COLORS.BLUE} d="M15.3 10.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"/>
        </svg>
    )
}