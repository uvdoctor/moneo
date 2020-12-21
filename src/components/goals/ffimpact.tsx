import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { GoalContext } from './GoalContext';

interface FFImpactProps {
	impactYears?: number | null
}

export default function FFImpact({impactYears}: FFImpactProps) {
	const { ffImpactYears }: any = useContext(GoalContext);
	const getUnit = () => (Math.abs(ffImpactYears as number) > 1 ? ' Years ' : ' Year ');
	const getImpactText = () => ((ffImpactYears as number) > 0 ? 'Earlier' : 'Later');
	const totalImpactYears = impactYears !== undefined ? impactYears : ffImpactYears;

	return totalImpactYears !== null ? totalImpactYears === 0 ? (
		<ItemDisplay
			label="Impact"
			result="No Delay"
			info="This Goal does not delay Your Financial Independence Year."
		/>
	) : (
		<ItemDisplay
			label="Impact"
			pl
			unit={`${getUnit()}`}
			result={ffImpactYears}
			info={`You May Achieve Financial Independence ${Math.abs(ffImpactYears)} ${getUnit()} 
                        ${getImpactText()} due to this Goal.`}
		/>
	) : (
		<ItemDisplay
			label="Impact"
			result="Unable to Determine"
			info={`Financial Independence Impact can only be determined once Financial Independence Age is determined. Please change Your Goals / Inputs and try again.`}
		/>
	);
}
