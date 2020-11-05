import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import { CALC_NAMES } from '../CONSTANTS';

export default function BuyOrRent() {
	return (
		<Layout
			title={CALC_NAMES.BR}
			type={GoalType.B}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay key="1" result="Option that costs lesser" />,
				<ItemDisplay key="2" result="Time till which the Option costs lesser" />,
				<ItemDisplay key="3" result={`Yearly Cash Flows for Buying`} />,
				<ItemDisplay
					key="4"
					result="Yearly Interest & Principal if Bought via Loan"
				/>
			]}
			resultImg="step1.png"
		/>
	);
}
