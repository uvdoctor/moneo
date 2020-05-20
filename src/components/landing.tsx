import React, { useState, useEffect } from 'react'
import { ROUTES } from '../CONSTANTS'
import Header from './header'
import Link from 'next/link'
import HomeSVG from './goals/svghome'
import CarSVG from './goals/svgcar'
import DiamondSVG from './goals/svgdiamond'
import DegreeSVG from './goals/svgdegree'
import TravelSVG from './goals/svgtravel'

const Landing = () => {
	const [homeSvg, setHomeSvg] = useState(false);
	const [carSvg, setCarSvg] = useState(false);
	const [diamondSvg, setDiamondSvg] = useState(false);
	const [degreeSvg, setDegreeSvg] = useState(false);
	const [worldTravelSvg, setWorldTravelSvg] = useState(false);
	const svgs = [
		{ svg: homeSvg, setter: setHomeSvg },
		{ svg: carSvg, setter: setCarSvg },
		{ svg: degreeSvg, setter: setDegreeSvg },
		{ svg: worldTravelSvg, setter: setWorldTravelSvg },
		{ svg: diamondSvg, setter: setDiamondSvg }
	];
	const [svgCtr, setSvgCtr] = useState(0);
	const animationStyle = "transient 2s linear";

	useEffect(
		() => {
			setTimeout(() => {
				svgs[svgCtr].svg ? svgs[svgCtr].setter(false) : svgs[svgCtr].setter(true);
				if (svgCtr > 0) svgs[svgCtr - 1].setter(false);
				svgCtr === svgs.length - 1 ? setSvgCtr(0) : setSvgCtr(svgCtr + 1);
			}, 2000);
		},
		[svgCtr, svgs]
	);

	return (
		<div
			className="h-screen w-screen bg-cover"
			//style={{ backgroundColor: '#F8FDFA' }}
			style={{ backgroundImage: "url('images/family-freedom.jpg')" }}
		>
			<div className="text-xl md:text-2xl lg:text-4xl text-center">
				<Header />
				<p className="mt-4 md:mt-8 lg:mt-12">Evolves Savings, Investments & Habits to</p>
				<p className="flex justify-center mt-4">
					<Link href={ROUTES.DASHBOARD}>
						<a>
						<div className="flex flex-align-center px-4 rounded bg-red-600 text-white font-bold">
							<label className="px-4 py-2 rounded bg-red-600 text-white font-bold">Meet Your Goals</label>
							<div className="mr-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
								{homeSvg && <HomeSVG animationStyle={animationStyle} />}
								{carSvg && <CarSVG animationStyle={animationStyle} />}
								{diamondSvg && <DiamondSVG animationStyle={animationStyle} />}
								{degreeSvg && <DegreeSVG animationStyle={animationStyle} />}
								{worldTravelSvg && <TravelSVG animationStyle={animationStyle} />}
							</div>
						</div>
						</a>
					</Link>
				</p>
				<div className="mt-4">
					<label>No Budgets.</label>
					<label className="ml-4">No Commissions.</label>
				</div>
			</div>
			{/**<div className="md:w-1/3 ml-2 mr-2 mt-4 md:ml-0 md:mr-8 lg:mr-12 xl:mr-24">
				<img alt="Calculator" src="images/mobile.png" />
	</div>**/}
		</div>
	);
}

export default Landing