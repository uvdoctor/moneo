import React from 'react'
import Logo from './logo'
import Link from 'next/link'
import { ROUTES } from '../CONSTANTS'
//@ts-ignore
import {AwesomeButton} from 'react-awesome-button'

const Header = () => {
	return (
		<nav className="md:text-lg lg:text-xl fixed flex w-full bg-white items-center justify-between flex-wrap py-1 top-0 animated items-center cursor font-bold">
			<Logo />
			<div className="flex items-center">
				<div className="hoverable relative inline-block hover:text-green-600 cursor">
					<label>About</label>
					<ul className="px-2 md:px-4 py-1 dropdown-menu absolute shadow-xl bg-green-600 text-white font-normal text-base md:text-lg">
						<li className="py-1 hover:text-black">Features</li>
						<li className="py-1 hover:text-black">Price</li>
						<li className="py-1 hover:text-black">Company</li>
					</ul>
				</div>
				<div className="ml-3 md:ml-12 hover:text-green-600"><Link href="#"><a>Learn</a></Link></div>
				<div className="ml-3 sm:ml-8 md:ml-12 flex items-center">
					<div className="hover:text-green-600 pr-5"><Link href={ROUTES.DASHBOARD}><a>Login</a></Link></div>
					<Link href={ROUTES.DASHBOARD}><a>
						<AwesomeButton ripple type="link">FREE TRIAL</AwesomeButton>
					</a></Link>
				</div>
			</div>
		</nav>
	);
}

export default Header
