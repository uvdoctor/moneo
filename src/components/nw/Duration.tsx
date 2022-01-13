import React, { useState } from 'react';
import { HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { calculateAddYears, calculateDifferenceInYears } from './valuationutils';

interface DurationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function Duration({ data, record, changeData }: DurationProps) {
	const [ duration, setDuration ] = useState<number>(
		calculateDifferenceInYears(record.em as number, record.ey as number, record.sm as number, record.sy as number)
	);

	const changeDuration = (val: number) => {
		setDuration(val);
		const { year, month } = calculateAddYears(record.sm as number, record.sy as number, duration);
		record.em = month;
		record.ey = year;
		changeData([ ...data ]);
	};

	return (
		<SelectInput
			pre={''}
			value={duration}
			changeHandler={(val: number) => changeDuration(val)}
			options={{ 5: 'Five Years', 10: 'Ten Years' }}
		/>
	);
}
