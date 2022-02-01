import React from 'react';
import { COLORS } from '../CONSTANTS';
import RadialInput from './form/radialinput';
import { toStringArr } from './utils';

interface LifeExpectancyProps {
	value: number;
	changeHandler: Function;
}

export default function LifeExpectancy({ value, changeHandler }: LifeExpectancyProps) {
	return (
		<RadialInput
			pre="Life Expectancy"
			label="Years"
			value={value}
			changeHandler={(val: number) => changeHandler(val)}
			step={1}
			data={toStringArr(70, 100, 1)}
			labelBottom
			trackColor={COLORS.WHITE}
			info="This will be used to define the duration for which Financial Planning is Needed."
		/>
	);
}
