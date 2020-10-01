import React from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';

interface SaveProps {
	inputOrder: number;
	currentOrder: number;
	nextStepHandler: Function;
	allInputDone: boolean;
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
		<div className="flex w-full justify-around">
			{(props.allInputDone || props.inputOrder <= props.currentOrder) && (
				<Section
					title="How much Do You Save from Your Work Income?"
					left={
						<NumberInput
							name="savings"
							pre="Yearly"
							post="Savings"
							currentOrder={props.currentOrder}
							inputOrder={props.inputOrder}
							allInputDone={props.allInputDone}
							nextStepDisabled={props.savings === 0}
							nextStepHandler={props.nextStepHandler}
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
							name="pw"
							pre="Total Paid"
							post="Work Weeks"
							note="in a Year"
							currentOrder={props.currentOrder}
							inputOrder={props.inputOrder + 1}
							allInputDone={props.allInputDone}
							nextStepDisabled={props.paidWeeks === 0}
							nextStepHandler={props.nextStepHandler}
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
							name="hrs"
							pre="Average"
							post="Work-Week"
							note="including commute, travel, etc."
							currentOrder={props.currentOrder}
							inputOrder={props.inputOrder + 2}
							allInputDone={props.allInputDone}
							nextStepDisabled={props.hoursPerWeek === 0}
							nextStepHandler={props.nextStepHandler}
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
			)}
		</div>
	);
}
