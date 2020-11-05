import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import { CALC_NAMES } from '../CONSTANTS';

export default function Loan() {
	return (
		<Layout
			title={CALC_NAMES.LOAN}
			type={GoalType.O}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay result={`Yearly Cash Flows`} />,
				<ItemDisplay result="Yearly Interest & Principal" />
			]}
			resultImg="step1.png"
		/>
	);
}
