import React from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';

interface RateProps {
	data?: Array<HoldingInput>;
	rate?: number;
	changeData: Function;
	record: HoldingInput;
	setRate?: Function;
	pre: string;
}

export default function Rate({ data, changeData, record, pre, rate, setRate }: RateProps) {
	const isListHolding: boolean = setRate ? false : true;
	const chg = isListHolding ? record.chg : rate;

	const changeRate = (val: number) => {
		setRate && setRate(val);
		record.chg = val;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<NumberInput pre={pre} min={0} max={50} value={chg as number} changeHandler={changeRate} step={0.1} unit="%" />
	);
}
