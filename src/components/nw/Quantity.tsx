import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { presentMonth, presentYear } from '../utils';
import { NWContext } from './NWContext';
import { hasPF } from './nwutils';

interface QuantityProps {
	data?: Array<HoldingInput>;
	qty?: number;
	changeData: Function;
	record: HoldingInput;
	setQty?: Function;
	pre: string;
	info: string;
}

export default function Quantity({ data, changeData, record, pre, qty, setQty, info }: QuantityProps) {
	const { childTab }: any = useContext(NWContext);
	const isListHolding: boolean = setQty ? false : true;
	const quantity = isListHolding ? record.qty : qty;

	const changeQty = (val: number) => {
		setQty && setQty(val);
		record.qty = val;
		if(hasPF(childTab)) {
			record.sm = presentMonth;
			record.sy = presentYear;
		}
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<NumberInput
			pre={pre}
			info={info}
			value={quantity as number}
			changeHandler={changeQty}
			currency={record.curr as string}
			min={1}
		/>
	);
}
