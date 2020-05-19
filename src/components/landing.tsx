import React, { useState, useEffect } from 'react'
import { ROUTES } from '../CONSTANTS'
import Header from './header'
import { NextPage } from 'next'
import Link from 'next/link'
import HomeSVG from './goals/home'
import CarSVG from './goals/car'
import DiamondSVG from './goals/diamond'
import DegreeSVG from './goals/degree'
import TravelSVG from './goals/travel'

interface Props {}

const LandingPage: NextPage<Props> = () => {
	const [ homeSvg, setHomeSvg ] = useState(false);
	const [ carSvg, setCarSvg ] = useState(false);
	const [ diamondSvg, setDiamondSvg ] = useState(false);
	const [ degreeSvg, setDegreeSvg ] = useState(false);
	const [ worldTravelSvg, setWorldTravelSvg ] = useState(false);
	const svgs = [
		{ svg: homeSvg, setter: setHomeSvg },
		{ svg: carSvg, setter: setCarSvg },
		{ svg: degreeSvg, setter: setDegreeSvg },
		{ svg: worldTravelSvg, setter: setWorldTravelSvg },
		{ svg: diamondSvg, setter: setDiamondSvg }
	];
	const [ svgCtr, setSvgCtr ] = useState(0);

	useEffect(
		() => {
			setTimeout(() => {
				svgs[svgCtr].svg ? svgs[svgCtr].setter(false) : svgs[svgCtr].setter(true);
				if (svgCtr > 0) svgs[svgCtr - 1].setter(false);
				svgCtr === svgs.length - 1 ? setSvgCtr(0) : setSvgCtr(svgCtr + 1);
			}, 2000);
		},
		[ svgCtr, svgs ]
	);

	return (
		<div
			className="md:flex md:flex-align-center md:justify-around h-full w-full"
			style={{ backgroundColor: '#F8FDFA' }}
		>
			<div className="w-full md:w-2/3 text-xl md:text-2xl lg:text-4xl text-center">
				<div className="md:mt-4 lg:mt-8 w-full">
					<Header />
				</div>
				<p className="mt-4 md:mt-8 lg:mt-12">Evolves Savings & Investments to</p>
				<ul className="flex justify-center flex-align-center">
					<li>Meet Your Goals</li>
					<li className="ml-2 md:ml-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
					{homeSvg && <HomeSVG />}
					{carSvg && <CarSVG />}
					{diamondSvg && <DiamondSVG />}
					{degreeSvg && <DegreeSVG />}
					{worldTravelSvg && <TravelSVG />}
					</li>
				</ul>
				<p className="font-black mt-4 md:mt-8 lg:mt-12">Hello Financial Freedom!</p>
				<div className="flex justify-center">
					<p>No Worries.</p>
					<p className="ml-4">No Budgets.</p>
				</div>
				<div className="flex justify-center mt-4 md:mt-8 lg:mt-12">
					<Link href={ROUTES.CALCULATE}>
						<a><label className="px-4 py-2 rounded bg-red-600 text-white font-bold">
							Try FREE Calculators
						</label></a>
					</Link>
				</div>
				<div className="flex justify-center mt-4 md:mt-8 lg:mt-12 font-black">
					<p>Unbiased.</p>
					<p className="ml-4 lg:ml-8">No Commissions.</p>
				</div>
			</div>
			<div className="md:w-1/3 ml-2 mr-2 mt-4 md:ml-0 md:mr-8 lg:mr-12 xl:mr-24">
				<img alt="Calculator" src="images/mobile.png" />
			</div>
		</div>
	);
}

export default LandingPage