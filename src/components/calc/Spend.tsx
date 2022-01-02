import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { toCurrency, toHumanFriendlyCurrency } from '../utils';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { TrueCostContext } from './TrueCostContext';

export const SPEND_ONCE = 'Once';
export const SPEND_MONTHLY = 'Monthly';
export const SPEND_YEARLY = 'Yearly';

export default function Spend() {
	const { currency, setCurrency }: any = useContext(CalcContext);
	const { freq, setFreq, amt, setAmt, duration, setDuration, totalCost }: any = useContext(TrueCostContext);
	const freqOptions = {
		[SPEND_ONCE]: SPEND_ONCE,
		[SPEND_MONTHLY]: SPEND_MONTHLY,
		[SPEND_YEARLY]: SPEND_YEARLY
	};

	return (
		<Section title="Enter Spend Details">
			<SelectInput
				pre="Spending frequency"
				value={freq}
				changeHandler={setFreq}
				options={freqOptions}
				info="Frequency at which you wish to spend - One time, Monthly or Yearly."
			/>
			<SelectInput pre="Currency" value={currency} changeHandler={setCurrency} currency />
			<NumberInput
				pre="Amount"
				value={amt}
				changeHandler={setAmt}
				min={10}
				step={10}
				currency={currency}
				info={`Amount that you wish to spend${freq === SPEND_MONTHLY
					? ' on monthly basis '
					: freq === SPEND_YEARLY ? ' on yearly basis ' : ''}.`}
			/>
			{freq !== SPEND_ONCE && (
				<NumberInput
					pre="Duration"
					value={duration}
					changeHandler={setDuration}
					min={2}
					max={freq === SPEND_MONTHLY ? 360 : 30}
					unit={freq === SPEND_MONTHLY ? 'months' : 'years'}
					info={`Number of ${freq === SPEND_MONTHLY ? 'months' : 'years'} you wish to spend for.`}
				/>
			)}
			{freq !== SPEND_ONCE && (
				<ItemDisplay
					label="Total Spend"
					result={totalCost}
					currency={currency}
					footer={`Over ${duration} ${freq === SPEND_MONTHLY ? 'months' : 'years'}`}
					info={`You spend total of ${toHumanFriendlyCurrency(totalCost, currency)} over ${duration} ${freq === SPEND_MONTHLY
						? 'months'
						: 'years'} given spending of ${toCurrency(amt, currency)} every ${freq === SPEND_MONTHLY
						? 'month'
						: 'year'}.`}
				/>
			)}
		</Section>
	);
}
