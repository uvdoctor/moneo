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
		<Section title="Enter Spend Details" videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}>
			<SelectInput
				pre="Spend"
				value={freq}
				changeHandler={setFreq}
				options={freqOptions}
				info="Frequency at which You wish to Spend - One time, Monthly or Yearly."
			/>
			<SelectInput pre="Currency" value={currency} changeHandler={setCurrency} currency />
			<NumberInput
				pre="Amount"
				value={amt}
				changeHandler={setAmt}
				min={100}
				max={50000}
				step={100}
				currency={currency}
				info={`Amount that You wish to Spend${freq === SPEND_MONTHLY
					? ' on Monthly basis '
					: freq === SPEND_YEARLY ? ' on Yearly basis ' : ''}.`}
			/>
			{freq !== SPEND_ONCE && (
				<NumberInput
					pre="Duration"
					value={duration}
					changeHandler={setDuration}
					min={2}
					max={freq === SPEND_MONTHLY ? 360 : 30}
					step={1}
					unit={freq === SPEND_MONTHLY ? 'Months' : 'Years'}
					info={`Number of ${freq === SPEND_MONTHLY ? 'Months' : 'Years'} You wish to Spend for.`}
				/>
			)}
			{freq !== SPEND_ONCE && (
				<ItemDisplay
					label="Total Spend"
					result={totalCost}
					currency={currency}
					footer={`Over ${duration} ${freq === SPEND_MONTHLY ? 'Months' : 'Years'}`}
					info={`You Spend total of ${toHumanFriendlyCurrency(totalCost, currency)} over ${duration} ${freq === SPEND_MONTHLY
						? 'Months'
						: 'Years'} given spending of ${toCurrency(amt, currency)} every ${freq === SPEND_MONTHLY
						? 'Month'
						: 'Year'}.`}
				/>
			)}
		</Section>
	);
}
