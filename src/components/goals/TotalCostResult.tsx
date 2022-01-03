import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import ItemDisplay from '../calc/ItemDisplay';
import { toHumanFriendlyCurrency } from '../utils';
import { GoalContext } from './GoalContext';

export default function TotalCostResult() {
	const { currency }: any = useContext(CalcContext);
	const { totalCost }: any = useContext(GoalContext);
	return (
		<ItemDisplay
			key={totalCost}
			label="Total Cost"
			result={totalCost}
			currency={currency}
			pl
			info={`You may spend total of about ${toHumanFriendlyCurrency(totalCost, currency)} due to this goal.`}
		/>
	);
}
