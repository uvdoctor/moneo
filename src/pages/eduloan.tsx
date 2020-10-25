import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGMoneyBag from '../components/calc/svgmoneybag';
import SVGBarChart from '../components/svgbarchart';
import SVGChart from '../components/svgchart';
import { CALC_NAMES } from '../CONSTANTS';
import { GoalContextProvider } from '../components/goals/GoalContext';

export default function EduLoan() {
	return (
		<Layout
			calc={GoalContextProvider}
			title={CALC_NAMES.EDU_LOAN}
			type={GoalType.E}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay result={`Yearly Cash Flows`} svg={<SVGChart selected />} />,
				<ItemDisplay result="Simple Interest Payment Schedule While Studying" svg={<SVGMoneyBag selected />} />,
				<ItemDisplay result="Yearly Interest & Principal for EMI Payments" svg={<SVGBarChart selected />} />
			]}
			resultImg="step1.png"
		/>
	);
}
