import React from 'react';
import ItemDisplay from '../calc/ItemDisplay';

interface FIImpactViewProps {
	impactYears: number | null;
}

export default function FIImpactView({ impactYears }: FIImpactViewProps) {
	return impactYears !== null ? impactYears === 0 ? (
		<ItemDisplay
			label="FI Impact"
			result="No Delay"
			info="This Goal does not delay Your Financial Independence Year."
		/>
	) : (
		<ItemDisplay
			label="FI Impact"
			pl
			unit={Math.abs(impactYears as number) > 1 ? ' Years ' : ' Year '}
			result={impactYears}
			info={`You May Achieve Financial Independence ${Math.abs(impactYears)} ${Math.abs(impactYears as number) > 1
				? ' Years '
				: ' Year '} 
                        ${(impactYears as number) > 0 ? 'Earlier' : 'Later'} due to this Goal.`}
		/>
	) : (
		<ItemDisplay
			label="FI Impact"
			result="Unable to Determine"
			info={`Financial Independence Impact can only be determined once Financial Independence Age is determined.`}
		/>
	);
}
