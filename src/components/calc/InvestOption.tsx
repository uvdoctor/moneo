import React from 'react';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import { toStringArr } from '../utils';

interface InvestOptionProps {
	inputOrder: number;
	currentOrder: number;
	nextStepHandler: Function;
	allInputDone: boolean;
	dr: number;
	drHandler: Function;
	years: number;
	yearsHandler: Function;
	durationInYears: number;
}

export default function InvestOption(props: InvestOptionProps) {

	return (
		<div className="flex w-full justify-around">
			{(props.allInputDone || props.inputOrder <= props.currentOrder) && (
				<Section
					title="How much Do Your Investments Earn?"
					left={
						<NumberInput
							name="dr"
							pre="Investments"
							post="Earn"
							note="after taxes & fees"
							currentOrder={props.currentOrder}
							inputOrder={props.inputOrder}
							allInputDone={props.allInputDone}
							nextStepDisabled={false}
							nextStepHandler={props.nextStepHandler}
							value={props.dr}
							changeHandler={props.drHandler}
							min={0}
							max={15}
							step={0.1}
							unit="%"
						/>
					}
					right={
						<RadialInput
							pre="Compare Till"
							data={toStringArr(30, 50, 5)}
							step={5}
							currentOrder={props.currentOrder}
							inputOrder={props.inputOrder + 1}
							allInputDone={props.allInputDone}
							nextStepDisabled={false}
							nextStepHandler={props.nextStepHandler}
							value={props.years}
							changeHandler={props.yearsHandler}
							label="Years"
							labelBottom
							width={120}
						/>
					}
					insideForm
				/>
			)}
		</div>
	);
}
