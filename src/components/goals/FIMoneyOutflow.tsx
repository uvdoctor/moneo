import React, { Fragment, useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import { toCurrency } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import DynamicTargetInput from '../form/DynamicTargetInput';
import { CalcContext } from '../calc/CalcContext';

export default function FIMoneyOutflow() {
	const {
		currency,
		startYear
	}: any = useContext(CalcContext);
	const {
		leaveBehind,
		setLeaveBehind,
		successionTaxRate,
		setSuccessionTaxRate,
		planDuration
	}: any = useContext(FIGoalContext);

	return (
		<Fragment>
			<Section
				title={`Nominees Inherit ~ ${toCurrency(
					Math.round(leaveBehind * (1 - successionTaxRate / 100)),
					currency
				)}`}
			>
				<NumberInput
					value={leaveBehind}
					changeHandler={setLeaveBehind}
					min={0}
					max={500000}
					pre="Amount"
					currency={currency}
					step={1000}
					post={`in ${startYear + planDuration}`}
				/>
				{leaveBehind > 0 && (
					<NumberInput
						pre="Inheritance Tax Rate"
						max={20}
						step={0.1}
						value={successionTaxRate}
						changeHandler={setSuccessionTaxRate}
						unit="%"
						post={`Total ${toCurrency(Math.round(leaveBehind * (successionTaxRate / 100)), currency)}`}
					/>
				)}
			</Section>
			<Section title="Expected major spends">
				<DynamicTargetInput lossInput />
			</Section>
		</Fragment>
	);
}
