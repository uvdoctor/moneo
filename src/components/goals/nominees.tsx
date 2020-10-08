import React from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import { toCurrency } from '../utils';

interface NomineesProps {
	currency: string;
	rangeFactor: number;
	leaveBehind: number;
	leaveBehindHandler: Function;
	successionTaxRate: number;
	successionTaxRateHandler: Function;
	endYear: number;
}

export default function Nominees({
	currency,
	rangeFactor,
	leaveBehind,
	leaveBehindHandler,
	successionTaxRate,
	successionTaxRateHandler,
	endYear
}: NomineesProps) {
	return (
		<Section
			title={`Nominees Inherit At least ~ ${toCurrency(
				Math.round(leaveBehind * (1 - successionTaxRate / 100)),
				currency
			)}`}
			left={
				<NumberInput
					name="lb"
					value={leaveBehind}
					changeHandler={leaveBehindHandler}
					rangeFactor={rangeFactor}
					min={0}
					max={500000}
					pre="Amount"
					currency={currency}
					step={1000}
					post={`in ${endYear + 1}`}
				/>
			}
			right={
				leaveBehind > 0 && (
					<NumberInput
						name="str"
						pre="Inheritance"
						post="Tax Rate"
						min={0}
						max={20}
						step={0.1}
						value={successionTaxRate}
						changeHandler={successionTaxRateHandler}
						unit="%"
						note={`Total ${toCurrency(Math.round(leaveBehind * (successionTaxRate / 100)), currency)}`}
					/>
				)
			}
			insideForm
		/>
	);
}
