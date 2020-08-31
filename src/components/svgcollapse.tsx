import React from 'react'
import { COLORS } from '../CONSTANTS'

export default function SVGCollapse() {
    return (
        <svg className="w-5 cursor-pointer" viewBox="0 0 24 24">
            <circle stroke={COLORS.BLUE} fill="none" cx="12" cy="12" r="10" />
            <rect fill={COLORS.BLUE} width="12" height="2" x="6" y="11" rx="1" />
        </svg>
    )
}