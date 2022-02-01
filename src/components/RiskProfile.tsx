import React from 'react';
import SelectInput from './form/selectinput';
import { getRiskProfileOptions } from './utils';

interface RiskProfileProps {
	value: string;
	changeHandler: Function;
}

export default function RiskProfile({ value, changeHandler }: RiskProfileProps) {
	return (
		<SelectInput
			info="How much Risk are You willing to take in order to achieve higher Investment Return?"
			pre="Can Tolerate"
			unit="Loss"
			value={value}
			changeHandler={(val: string) => changeHandler(val)}
			options={getRiskProfileOptions()}
		/>
	);
}
