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
			<div className="flex flex-align-center">
			<Link href={ROUTES.DASHBOARD}><a>Login</a></Link>
			<Link href={ROUTES.DASHBOARD}><a>
				<div className="ml-2 md:ml-4 px-2 md:px-4 py-1 md:py-2 rounded bg-green-600 text-white font-bold">Start</div>
			</a></Link>
			</div>
		</nav>
	);
}

export default Header
