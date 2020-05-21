import React, { useState, useEffect } from 'react'
import { ROUTES } from '../CONSTANTS'
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
		<div className="text-lg md:text-xl lg:text-2xl text-center overflow-hidden w-screen" style={{ backgroundColor: '#f8fDfA' }}>
			<p className="text-2xl md:text-4xl font-black mt-16 md:mt-24">Your Financial Analyst</p>
			<div className="md:flex">
				<div className="flex justify-center w-full md:w-1/3">
					<img className="object-fit" alt="Smart Money" src="images/smartmoney.png" />
				</div>
				<ul className="mt-4 md:mt-24 w-full md:w-2/3">
					<li>Evolve Savings, Investments & Habits</li>
					<li className="flex justify-center mt-4 cursor">
						<Link href={ROUTES.DASHBOARD}>
							<a>
								<div className="flex flex-align-center px-4 py-2 rounded bg-green-600 text-white font-bold cursor">
									Meet Your Goals
								<div className="ml-2 md:ml-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 cursor">
										{homeSvg && <HomeSVG animationStyle={animationStyle} />}
										{carSvg && <CarSVG animationStyle={animationStyle} />}
										{diamondSvg && <DiamondSVG animationStyle={animationStyle} />}
										{degreeSvg && <DegreeSVG animationStyle={animationStyle} />}
										{worldTravelSvg && <TravelSVG animationStyle={animationStyle} />}
									</div>
								</div>
							</a>
						</Link>
					</li>
					<li className="mt-4">No Budgets. No Commissions.</li>
				</ul>
			</div>
		</div>
	)
}

export default Landing