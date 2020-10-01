import React from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';

interface InvestProps {
	inputOrder: number;
	currentOrder: number;
	nextStepHandler: Function;
	allInputDone: boolean;
	dr: number;
	drHandler: Function;
	years: number;
	yearsHandler: Function;
	currency: string;
	rangeFactor: number;
}

export default function Invest(props: InvestProps) {
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
							currency={props.currency}
							rangeFactor={props.rangeFactor}
							min={0}
							max={15}
							step={0.1}
						/>
					}
					right={
						<NumberInput
							name="yrs"
							pre="Compare"
							post="From 1 to"
							currentOrder={props.currentOrder}
							inputOrder={props.inputOrder + 1}
							allInputDone={props.allInputDone}
							nextStepDisabled={false}
							nextStepHandler={props.nextStepHandler}
							value={props.years}
							changeHandler={props.yearsHandler}
							min={0}
							max={50}
							step={1}
							unit="Years"
						/>
					}
					insideForm
				/>
			)}
		</div>
	);
}
