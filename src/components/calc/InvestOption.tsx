import React from 'react';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import { toStringArr } from '../utils';

interface InvestOptionProps {
	dr: number;
	drHandler: Function;
	years: number;
	yearsHandler: Function;
	durationInYears: number;
}

export default function InvestOption(props: InvestOptionProps) {
	return (
		<Section
			title="How much Do Your Investments Earn?"
			left={
				<NumberInput
					name="dr"
					pre="Investments"
					post="Earn Yearly"
					note="after taxes & fees"
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
					pre="Analyze From 1 to"
					data={toStringArr(30, 50, 5)}
					step={5}
					value={props.years}
					changeHandler={props.yearsHandler}
					label="Years"
					labelBottom
					width={120}
				/>
			}
			insideForm
		/>
	);
}
