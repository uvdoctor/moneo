import React, { useState, useEffect } from 'react'
import { ROUTES } from '../CONSTANTS'
import Link from 'next/link'
import HomeSVG from './goals/svghome'
import CarSVG from './goals/svgcar'
import DiamondSVG from './goals/svgdiamond'
import DegreeSVG from './goals/svgdegree'
import TravelSVG from './goals/svgtravel'
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'

const Landing = () => {
	const [svgCtr, setSvgCtr] = useState(-1);
	const animationStyle = "transient 2s linear";
	
	useEffect(
		() => {
			let timer = setTimeout(() => {
				setSvgCtr(svgCtr + 1)
			}, 2000);

			return() => clearInterval(timer)
		},
		[svgCtr]
	);

	return (
		<div className="text-lg md:text-xl lg:text-2xl text-center overflow-hidden w-screen" style={{ backgroundColor: '#f8fDfA' }}>
			<p className="text-2xl md:text-4xl font-black mt-16">Your Financial Analyst</p>
			<div className="md:flex p-2">
				<ul className="mt-4 md:mt-12 w-full md:w-1/2">
					<li>Evolve Savings, Investments & Habits</li>
					<li className="flex justify-center mt-4 cursor">
						<Link href={ROUTES.DASHBOARD}>
							<a>
								<AwesomeButton ripple type="link" style={{animation: "fadeIn 2s ease-in 1"}}>
									MEET YOUR GOALS
									<div className="ml-2 md:ml-4 w-8 h-8 md:w-10 md:h-10">
										{svgCtr % 5 === 1 && <HomeSVG animationStyle={animationStyle} />}
										{svgCtr % 5 === 2 && <CarSVG animationStyle={animationStyle} />}
										{svgCtr % 5 === 3 && <DiamondSVG animationStyle={animationStyle} />}
										{svgCtr % 5 === 4 && <DegreeSVG animationStyle={animationStyle} />}
										{svgCtr % 5 === 0 && <TravelSVG animationStyle={animationStyle} />}
									</div>
								</AwesomeButton>
							</a>
						</Link>
					</li>
					<li className="mt-2">Across Multiple Currencies.</li>
					<li className="mt-8 md:mt-16 lg:mt-24">Unbiased. No Commissions.</li>
					<li>Secure. You Own Your Data.</li>
					<li>No More Boring Budgets.</li>
				</ul>
				<div className="w-full md:w-1/2 xl:w-1/3">
					<img className="p-3 object-fit" alt="Smart Money" src="images/smartmoney.png" />
				</div>
			</div>
		</div>
	)
}

export default Landing