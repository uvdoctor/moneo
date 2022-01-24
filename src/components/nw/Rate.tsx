import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import { NWContext, TAB } from './NWContext';

interface RateProps {
	data?: Array<any>;
	rate?: number;
	changeData: Function;
	record: any;
	setRate?: Function;
	pre: string;
	setIndexForMv?: Function;
	index?: number;
}

export default function Rate({ data, changeData, record, pre, rate, setRate, setIndexForMv, index }: RateProps) {
	const { childTab }: any = useContext(NWContext);
	const isListHolding: boolean = setRate ? false : true;
	const chg = isListHolding ? (childTab === TAB.PROP ? record.rate : record.chg) : rate;

	const changeRate = (val: number) => {
		setRate && setRate(val);
		if (childTab === TAB.PROP) {
			record.rate ? (record.rate = val) : '';
			setIndexForMv && setIndexForMv(index);
		} else {
			record.chg = val;
		}
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<NumberInput pre={pre} min={0} max={50} value={chg as number} changeHandler={changeRate} step={0.1} unit="%" />
	);
}