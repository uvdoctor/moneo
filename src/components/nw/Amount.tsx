import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { presentMonth, presentYear } from '../utils';
import { NWContext, TAB } from './NWContext';
import { hasPF, hasQtyWithRate } from './nwutils';
import QuantityWithRate from './QuantityWithRate';

interface AmountProps {
	data?: Array<HoldingInput>;
	qty?: number;
	amt?: number;
	changeData: Function;
	record: HoldingInput;
	setAmt?: Function;
	setQty?: Function;
	fields?: any
}

export default function Amount({ data, changeData, record, setAmt, setQty, qty, amt, fields }: AmountProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO } = TAB;
	const isListHolding: boolean = setAmt || setQty ? false : true;
	const amount = isListHolding ? record.amt : amt;
	const quantity = isListHolding ? record.qty : qty;

	const changeAmt = (amt: number) => {
		setAmt && setAmt(amt);
		if (hasPF(childTab)) {
			record.sm = presentMonth;
			record.sy = presentYear;
		}
		record.amt = amt;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	const changeQty = (qty: number) => {
		setQty && setQty(qty);
		record.qty = qty;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	return hasQtyWithRate(childTab) ? (
		<QuantityWithRate
			pre={isListHolding ? '' : fields.qty}
			quantity={quantity as number}
			name={record.name as string}
			subtype={childTab === CRYPTO ? record.name as string : record.subt as string}
			onChange={(val: number) => changeQty(val)}
		/>
	) : (
		<NumberInput
			pre={isListHolding ? '' : fields.amount}
			value={amount as number}
			changeHandler={(val: number) => changeAmt(val)}
			currency={record.curr as string}
			min={1}
		/>
	);
}
