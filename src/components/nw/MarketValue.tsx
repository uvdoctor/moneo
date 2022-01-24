import React from 'react';
import { PropertyInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { presentMonth, presentYear } from '../utils';

interface MarketValueProps {
	data?: Array<PropertyInput>;
	changeData: Function;
	record: PropertyInput;
	pre: string;
	mv?: number;
	setMv?: Function;
	setMvm?: Function;
	setMvy?: Function;
}

export default function MarketValue({ data, changeData, record, pre, mv, setMv, setMvm, setMvy }: MarketValueProps) {
	const isListProperty: boolean = setMv ? false : true;
	const marketValue = isListProperty ? record.mv : mv;

	const changeMv = (val: number) => {
		setMv && setMv(val);
		setMvm && setMvm(presentMonth);
		setMvy && setMvy(presentYear);
		record.mv = val;
		record.mvm = presentMonth;
		record.mvy = presentYear;
		isListProperty && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<NumberInput
			pre={pre}
			min={1}
			value={marketValue as number}
			changeHandler={changeMv}
			currency={record.curr as string}
		/>
	);
}
