import React, { useContext } from 'react';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function FIYearResult() {
	const { ffResult }: any = useContext(CalcContext);

	return (
		<ItemDisplay
			label="Earliest In Year"
			result={""+ffResult.ffYear}
			info={`You May achieve Financial Independence earliest in ${ffResult.ffYear}.`}
			unit=""
			noResultFormat
			imp={
				ffResult.oom ? (
					`You May Not Have Enough Savings in Years ${ffResult.oom.map((year: number) => ` ${year}`)}`
				) : (
					''
				)
			}
		/>
	);
}
