import React from 'react';
import ActionableSVG from './svgactionable'
import FunSVG from './svgfun'
import PersonalizedSVG from './svgpersonalized'
import SecureSVG from './svgsecure'
import GlobalSVG from './svgglobal'
import PrivateSVG from './svgprivate'

interface Feature {
	svg: React.ReactNode,
	title: string,
	desc: string
}

const Features = () => {
	const features: Array<Feature> =
		[
			{
				svg: <PersonalizedSVG />,
				title: "Personalized",
				desc: "Insights based on Your Goals, Risk Threshold & financial health."
			},
			{
				svg: <FunSVG />,
				title: "Fun",
				desc: "Games to help You make Smart Money decisions."
			},
			{
				svg: <ActionableSVG />,
				title: "Actionable",
				desc: "See what You have to achieve today & how it will affect tomorrow."
			},
			{
				svg: <SecureSVG />,
				title: "Secure",
				desc: "Uses latest encryption technology to keep your Identity & Data secure."
			},
			{
				svg: <GlobalSVG />,
				title: "Global",
				desc: "Time-tested money concepts that work wherever You are."
			},
			{
				svg: <PrivateSVG />,
				title: "Private",
				desc: "Respects Data Privacy."
			}
		]

	return (
		<div className="w-screen mt-4 flex flex-col justify-center text-xl md:text-2xl">
			<p className="text-center">Super Simple to set Goals.</p>
			<p className="text-center">Make money work hard to fulfill them.</p>

			<div className="flex flex-wrap justify-around">
				{features.map((f: Feature, i: number) =>
					<ul key={i} className="w-full flex flex-col justify-center flex-align-center md:w-1/2 lg:w-1/3 mt-4 ml-2 mr-2 text-center max-w-sm rounded overflow-hidden shadow-xl">
						<li className="mt-4 w-12 h-12">
							{f.svg}
						</li>
						<li className="text-xl font-bold">{f.title}</li>
						<li className="ml-4 mt-2 text-lg font-normal">{f.desc}</li>
					</ul>)}
			</div>
		</div>
	);
}

export default Features;
