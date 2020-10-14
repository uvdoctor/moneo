import React from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { toCurrency } from '../utils';

interface SpendProps {
	freq: string;
	freqHandler: Function;
	amt: number;
	amtHandler: Function;
	currency: string;
	rangeFactor: number;
	duration: number;
	durationHandler: Function;
	totalCost: number;
}

export const SPEND_ONCE = 'Once';
export const SPEND_MONTHLY = 'Monthly';
export const SPEND_YEARLY = 'Yearly';

export default function Spend(props: SpendProps) {
	const freqOptions = {
		[SPEND_ONCE]: SPEND_ONCE,
		[SPEND_MONTHLY]: SPEND_MONTHLY,
		[SPEND_YEARLY]: SPEND_YEARLY
	};

	return (
			<Section
				title="Enter Spend Details"
				left={
					<SelectInput
						pre="Spend"
						value={props.freq}
						changeHandler={props.freqHandler}
						options={freqOptions}
					/>
				}
				right={
					<NumberInput
						pre="Amount"
						value={props.amt}
						changeHandler={props.amtHandler}
						min={0}
						max={50000}
						step={100}
						currency={props.currency}
						rangeFactor={props.rangeFactor}
					/>
				}
				bottom={
					props.freq !== SPEND_ONCE && (
						<NumberInput
							pre="For"
							value={props.duration}
							changeHandler={props.durationHandler}
							min={0}
							max={props.freq === SPEND_MONTHLY ? 360 : 30}
							step={1}
							unit={props.freq === SPEND_MONTHLY ? 'Months' : 'Years'}
							note={`Total ${toCurrency(props.totalCost, props.currency)}`}
						/>
					)
				}
			/>
	);
}
