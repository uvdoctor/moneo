import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { TrueCostContext } from './TrueCostContext';

export const SPEND_ONCE = 'Once';
export const SPEND_MONTHLY = 'Monthly';
export const SPEND_YEARLY = 'Yearly';

export default function Spend() {
	const { currency }: any = useContext(CalcContext);
	const { freq, setFreq, amt, setAmt, duration, setDuration, totalCost }: any = useContext(TrueCostContext);
	const freqOptions = {
		[SPEND_ONCE]: SPEND_ONCE,
		[SPEND_MONTHLY]: SPEND_MONTHLY,
		[SPEND_YEARLY]: SPEND_YEARLY
	};

	return (
		<Section title="Enter Spend Details">
			<SelectInput pre="Spend" value={freq} changeHandler={setFreq} options={freqOptions} />
			<NumberInput
				pre="Amount"
				value={amt}
				changeHandler={setAmt}
				min={100}
				max={50000}
				step={100}
				currency={currency}
			/>
			{freq !== SPEND_ONCE && (
				<NumberInput
					pre="For"
					value={duration}
					changeHandler={setDuration}
					min={1}
					max={freq === SPEND_MONTHLY ? 360 : 30}
					step={1}
					unit={freq === SPEND_MONTHLY ? 'Months' : 'Years'}
					note={<ItemDisplay label="Total Spend" result={totalCost} currency={currency} />}
				/>
			)}
		</Section>
	);
}
