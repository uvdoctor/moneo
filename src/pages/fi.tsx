import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGAAChart from '../components/goals/svgaachart';
import SVGBarChart from '../components/svgbarchart';
import SVGChart from '../components/svgchart';
import SVGHourGlass from '../components/svghourglass';
import SVGPiggy from '../components/svgpiggy';
import { CALC_NAMES } from '../CONSTANTS';
import { CalcContextProvider } from '../components/calc/CalcContext';

export default function FI() {
	const nowYear = new Date().getFullYear();

	return (
		<CalcContextProvider title={CALC_NAMES.FI} type={GoalType.FF}>
			<Layout
				assumptions={[ 'adfas', 'asdfsad' ]}
				features={[ 'fsdgdf', 'fgdssdf' ]}
				results={[
					<ItemDisplay result="Earliest Possible Year for FI" svg={<SVGHourGlass />} />,
					<ItemDisplay result="Savings Needed for FI" svg={<SVGPiggy selected />} />,
					<ItemDisplay result={`${nowYear + 1} Asset Allocation`} svg={<SVGAAChart selected />} />,
					<ItemDisplay
						result={`Asset Allocation Plan from ${nowYear + 2} Onwards`}
						svg={<SVGBarChart selected />}
					/>,
					<ItemDisplay result={`Yearly Savings from ${nowYear + 1} Onwards`} svg={<SVGChart selected />} />
				]}
				resultImg="step1.png"
			/>
		</CalcContextProvider>
	);
}
