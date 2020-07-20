import React from 'react'

export default function SVGExpand() {
    return (
        <svg className="w-4 cursor-pointer" viewBox="0 0 24 24">
            <circle fill="#3182ce" cx="12" cy="12" r="10" />
            <path fill="white" d="M13 11h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4z" />
        </svg>
    )
}