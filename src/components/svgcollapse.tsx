import React from 'react'
import { COLORS } from '../CONSTANTS'

export default function SVGCollapse() {
    return (
        <svg className="w-6 cursor-pointer" viewBox="0 0 24 24">
            <path fill={COLORS.GREEN} d="M8.7 13.7a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L12 10.42l-3.3 3.3z"/>
        </svg>
    )
}