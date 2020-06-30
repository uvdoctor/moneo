/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { ROUTES } from '../CONSTANTS'
import Link from 'next/link'
import SVGLogo from './svglogo'

const Logo = () => {
	return (
		<Link href={ROUTES.HOME}><a>
			<SVGLogo />
		</a></Link>
	);
}

export default Logo