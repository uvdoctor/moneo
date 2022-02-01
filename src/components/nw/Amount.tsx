import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import { presentMonth, presentYear } from '../utils';
import { NWContext, TAB } from './NWContext';
import { hasPF, hasQtyWithRate } from './nwutils';
import QuantityWithRate from './QuantityWithRate';

interface AmountProps {
	data?: Array<any>;
	qty?: number;
	amt?: number;
	changeData: Function;
	record: any;
	setAmt?: Function;
	setQty?: Function;
	fields?: any;
	setIndexForMv?: Function;
	index?: number;
	info?: any
}

export default function Amount({
	data,
	changeData,
	record,
	setAmt,
	setQty,
	qty,
	amt,
	fields,
	setIndexForMv,
	index,
	info
}: AmountProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, PROP } = TAB;
	const isListHolding: boolean = setAmt || setQty ? false : true;
	const amount = isListHolding ? (childTab === PROP ? record.purchase.amt : record.amt) : amt;
	const quantity = isListHolding ? record.qty : qty;

	const changeAmt = (amt: number) => {
		setAmt && setAmt(amt);
		if (hasPF(childTab)) {
			record.sm = presentMonth;
			record.sy = presentYear;
		}
		if (childTab === PROP) {
			record.purchase ? (record.purchase.amt = amt) : '';
			setIndexForMv && setIndexForMv(index);
		} else {
			record.amt = amt;
		}
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
			info={isListHolding ? '' : info.qty}
			quantity={quantity as number}
			name={record.name as string}
			subtype={childTab === CRYPTO ? record.name as string : record.subt as string}
			onChange={(val: number) => changeQty(val)}
		/>
	) : (
		<NumberInput
			pre={childTab === PROP ? fields.amount : isListHolding ? '' : fields.amount}
			info={childTab === PROP ? info.amount : isListHolding ? '' : info.amount}
			value={amount as number}
			changeHandler={changeAmt}
			currency={record.curr as string}
			min={1}
		/>
	);
}
