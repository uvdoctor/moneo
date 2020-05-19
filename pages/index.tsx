import Head from 'next/head'
import { NextPage } from 'next'
import React from 'react'
import Link from 'next/link'

interface Props { }

const Home: NextPage<Props> = () => (
	<div className="container">
		<Head>
			<meta charSet="utf-8" />
			<link rel="icon" href="images/icons/favicon.ico" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<meta name="description" content="Your Financial Analyst" />
			<link rel="apple-touch-icon" href="images/icons/logo57.png" />
			<title>DollarDarwin</title>
			<link rel="manifest" href="manifest.json" />
		</Head>
		<main>
			<div className="font-black">Index</div>
			<Link href="/dashboard"><a>Dashboard</a></Link>
		</main>
	</div>
);

export default Home
