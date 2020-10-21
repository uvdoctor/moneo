import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGBarChart from '../components/svgbarchart';
import SVGChart from '../components/svgchart';
import { CALC_NAMES } from '../CONSTANTS';
import { CalcContextProvider } from '../components/calc/CalcContext';

export default function Loan() {
	return (
		<CalcContextProvider title={CALC_NAMES.LOAN} type={GoalType.O}>
			<Layout
				assumptions={[ 'adfas', 'asdfsad' ]}
				features={[ 'fsdgdf', 'fgdssdf' ]}
				results={[
					<ItemDisplay result={`Yearly Cash Flows`} svg={<SVGChart selected />} />,
					<ItemDisplay result="Yearly Interest & Principal" svg={<SVGBarChart selected />} />
				]}
				resultImg="step1.png"
			/>
		</CalcContextProvider>
	);
}
