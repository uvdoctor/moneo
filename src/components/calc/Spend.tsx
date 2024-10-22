import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { toHumanFriendlyCurrency } from '../utils';
import { CalcContext } from './CalcContext';
import { TrueCostContext } from './TrueCostContext';

export const SPEND_ONCE = 'Once';
export const SPEND_MONTHLY = 'Monthly';
export const SPEND_YEARLY = 'Yearly';

export default function Spend() {
	const { currency, setCurrency }: any = useContext(CalcContext);
	const { freq, setFreq, amt, setAmt, duration, setDuration, totalCost, savings, setSavings }: any = useContext(
		TrueCostContext
	);
	const freqOptions = {
		[SPEND_ONCE]: SPEND_ONCE,
		[SPEND_MONTHLY]: SPEND_MONTHLY,
		[SPEND_YEARLY]: SPEND_YEARLY
	};

	return (
		<Section
			title="Spending and Saving details"
			toggle={<SelectInput pre="" value={currency} changeHandler={setCurrency} currency />}>
			<SelectInput
				pre="Spend frequency"
				value={freq}
				changeHandler={setFreq}
				options={freqOptions}
				info="Frequency at which you wish to spend - One time, Monthly or Yearly."
			/>
			<NumberInput
				pre="Spend amount"
				value={amt}
				changeHandler={setAmt}
				min={1}
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
					post={`Total spend is ${toHumanFriendlyCurrency(totalCost, currency)}`}
				/>
			)}
			<NumberInput
				pre="Yearly savings"
				value={savings}
				changeHandler={setSavings}
				currency={currency}
				min={100}
				step={100}
				info="Amount you save yearly from your work income after deducting taxes & all expenses."
			/>
		</Section>
	);
}
