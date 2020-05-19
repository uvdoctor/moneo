import React from 'react'
import Logo from './logo'
import { NextPage } from 'next'

interface Props {}

const Header: NextPage<Props> = () => {
	return (
		<nav className="flex justify-center flex-align-center">
			<Logo />
			<p className="ml-4 md:ml-8 text-xl md:text-2xl lg:text-4xl font-black">Your Financial Analyst</p>
		</nav>
	);
}

export default Header
