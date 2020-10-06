/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { ROUTES } from '../CONSTANTS'
import Link from 'next/link'
import SVGLogo from './svglogo'

const Logo = () => {
	return (
		<Link href={ROUTES.HOME}><a>
			<div className="p-1"><SVGLogo /></div>
		</a></Link>
	);
}

export default Logo