import React from 'react';
import SelectInput from './form/selectinput';
import { getTaxLiabilityOptions } from './utils';

interface TaxLiabilityProps {
	value: string;
	changeHandler: Function;
}

export default function TaxLiabilityInput({ value, changeHandler }: TaxLiabilityProps) {
	return (
		<SelectInput
			info="How much do you earn in a year?"
			pre="Yearly Income"
			value={value}
			changeHandler={(val: string) => changeHandler(val)}
			options={getTaxLiabilityOptions()}
		/>
	);
}
