import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import FIImpactView from './FIImpactView';

export default function FIImpact() {
	const { ffImpactYears }: any = useContext(CalcContext);
	
	return <FIImpactView impactYears={ffImpactYears} />
}
