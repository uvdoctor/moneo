import React from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';

interface SaveProps {
	paidWeeks: number;
	paidWeeksHandler: Function;
	savings: number;
	savingsHandler: Function;
	currency: string;
	rangeFactor: number;
	hoursPerWeek: number;
	hoursPerWeekHandler: Function;
}

export default function Save(props: SaveProps) {
	return (
		<Section
			title="How much Do You Save from Your Work Income?"
			left={
				<NumberInput
					pre="Yearly"
					post="Savings"
					value={props.savings}
					changeHandler={props.savingsHandler}
					currency={props.currency}
					rangeFactor={props.rangeFactor}
					min={0}
					max={200000}
					step={1000}
				/>
			}
			right={
				<NumberInput
					pre="Total Paid"
					post="Work Weeks"
					note="in a Year"
					value={props.paidWeeks}
					changeHandler={props.paidWeeksHandler}
					min={0}
					max={52}
					step={1}
					unit="Weeks"
				/>
			}
			bottom={
				<NumberInput
					pre="Average"
					post="Work-week"
					note="including travel"
					value={props.hoursPerWeek}
					changeHandler={props.hoursPerWeekHandler}
					min={0}
					max={80}
					step={1}
					unit={'Hours'}
				/>
			}
			insideForm
		/>
	);
}
