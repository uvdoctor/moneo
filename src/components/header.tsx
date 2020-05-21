import React from 'react'
import Logo from './logo'
import Link from 'next/link'
import { ROUTES } from '../CONSTANTS';

const Header = () => {
	return (
		<nav className="md:text-lg lg:text-xl fixed flex w-full bg-white border-b items-center justify-between flex-wrap p-2 md:p-4 m-auto top-0 animated flex-align-center cursor">
			<Link href={ROUTES.HOME}><a><Logo /></a></Link>
			<Link href="#"><a>Pricing</a></Link>
			<Link href="#"><a>About</a></Link>
			<Link href={ROUTES.DASHBOARD}><a>Sign In</a></Link>
			<Link href={ROUTES.DASHBOARD}><a>
				<div className="px-2 md:px-4 py-1 md:py-2 rounded bg-red-600 text-white font-bold">Get Started</div>
			</a></Link>
		</nav>
	);
}

export default Header
