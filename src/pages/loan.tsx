import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGBarChart from '../components/svgbarchart';
import SVGChart from '../components/svgchart';
import { CALC_NAMES } from '../CONSTANTS';

export default function Loan() {
	return (
		<Layout
			title={CALC_NAMES.LOAN}
			type={GoalType.O}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay result={`Yearly Cash Flows`} svg={<SVGChart selected />} />,
				<ItemDisplay result="Yearly Interest & Principal" svg={<SVGBarChart selected />} />
			]}
			resultImg="step1.png"
		/>
	);
}
