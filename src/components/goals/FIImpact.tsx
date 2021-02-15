import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { GoalContext } from './GoalContext';

export default function FIImpact() {
	const { ffImpactYears }: any = useContext(GoalContext);

	return ffImpactYears !== null ? ffImpactYears === 0 ? (
		<ItemDisplay
			label="FI Impact"
			result="No Delay"
			info="This Goal does not delay Your Financial Independence Year."
		/>
	) : (
		<ItemDisplay
			label="FI Impact"
			pl
			unit={Math.abs(ffImpactYears as number) > 1 ? ' Years ' : ' Year '}
			result={ffImpactYears}
			info={`You May Achieve Financial Independence ${Math.abs(ffImpactYears)} ${Math.abs(ffImpactYears as number) > 1 ? ' Years ' : ' Year '} 
                        ${(ffImpactYears as number) > 0 ? 'Earlier' : 'Later'} due to this Goal.`}
		/>
	) : (
		<ItemDisplay
			label="FI Impact"
			result="Unable to Determine"
			info={`Financial Independence Impact can only be determined once Financial Independence Age is determined. Please change Your Goals / Inputs and try again.`}
		/>
	);
}
