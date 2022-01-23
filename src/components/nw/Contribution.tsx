import React from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { presentMonth, presentYear } from '../utils';

interface ContributionProps {
	data?: Array<HoldingInput>;
	qty?: number;
	changeData: Function;
	record: HoldingInput;
	setQty?: Function;
	pre: string;
}

export default function Contribution({ data, changeData, record, pre, qty, setQty }: ContributionProps) {
	const isListHolding: boolean = setQty ? false : true;
	const quantity = isListHolding ? record.qty : qty;

	const changeQty = (val: number) => {
		setQty && setQty(val);
		record.qty = val;
		record.sm = presentMonth;
		record.sy = presentYear;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<NumberInput
			pre={pre}
			value={quantity as number}
			changeHandler={changeQty}
			currency={record.curr as string}
			min={1}
		/>
	);
}
