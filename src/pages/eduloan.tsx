import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import { CALC_NAMES } from '../CONSTANTS';

export default function EduLoan() {
	return (
		<Layout
			title={CALC_NAMES.EDU_LOAN}
			type={GoalType.E}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay result={`Yearly Cash Flows`} />,
				<ItemDisplay result="Simple Interest Payment Schedule While Studying" />,
				<ItemDisplay result="Yearly Interest & Principal for EMI Payments" />
			]}
			resultImg="step1.png"
		/>
	);
}
