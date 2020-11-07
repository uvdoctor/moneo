import React from 'react';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import { CALC_NAMES } from '../CONSTANTS';
import { GoalType } from '../api/goals';

export default function FI() {
	const nowYear = new Date().getFullYear();

	return (
		<Layout
			title={CALC_NAMES.FI}
			type={GoalType.FF}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay key="r1" result="Earliest Possible Year for FI" />,
				<ItemDisplay key="r2" result="Savings Needed for FI" />,
				<ItemDisplay key="r3" result={`${nowYear + 1} Asset Allocation`} />,
				<ItemDisplay key="r4"
					result={`Asset Allocation Plan from ${nowYear + 2} Onwards`}
				/>,
				<ItemDisplay key="r5" result={`Yearly Savings from ${nowYear + 1} Onwards`} />
			]}
			resultImg="step1.png"
		/>
	);
}
