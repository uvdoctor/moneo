import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { TrueCostContext } from './TrueCostContext';

export default function Save() {
	const {
		hoursPerWeek,
		setHoursPerWeek,
		paidWeeks,
		setPaidWeeks
	}: any = useContext(TrueCostContext);
	return (
		<Section>
			<NumberInput
				pre="Yearly work weeks"
				value={paidWeeks}
				changeHandler={setPaidWeeks}
				min={4}
				max={52}
				unit="weeks"
				info="Total number of weeks you get paid in a year. If you are employed full-time & don't take any unpaid leave in a Year, then this implies 52 weeks."
			/>
			<NumberInput
				pre="Average work-week"
				value={hoursPerWeek}
				changeHandler={setHoursPerWeek}
				min={10}
				max={80}
				unit="hours"
				info="Average number of hours you spend for work in a week, including commute time, business travel, and time spent for any other work-related activity."
			/>
		</Section>
	);
}
