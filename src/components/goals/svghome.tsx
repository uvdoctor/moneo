import React from 'react'

interface HomeSVGProps {
	animationStyle: string
}

export default function HomeSVG({animationStyle} : HomeSVGProps) {
    return (
        <svg fill="white" viewBox="0 0 24 24" className="w-10" style={{animation: animationStyle}}>
			<path d="M9 22H5a1 1 0 0 1-1-1V11l8-8 8 8v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1zm3-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
			<path d="M12.01 4.42l-8.3 8.3a1 1 0 1 1-1.42-1.41l9.02-9.02a1 1 0 0 1 1.41 0l8.99 9.02a1 1 0 0 1-1.42 1.41l-8.28-8.3z"/>
		</svg>
    )
}