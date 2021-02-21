import React, { useContext } from 'react';
import FIImpactView from './FIImpactView';
import { GoalContext } from './GoalContext';

export default function FIImpact() {
	const { ffImpactYears }: any = useContext(GoalContext);
	
	return <FIImpactView impactYears={ffImpactYears} />
}
