import React, { useContext, useEffect } from 'react';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import DateInput from '../form/DateInput';
import { hasOnlyEnddate, isRangePicker } from './nwutils';
import { calculateAddYears } from './valuationutils';

interface MemberAndValuationProps {
	data?: Array<any>;
	changeData: Function;
	record: any;
	sm?: number;
	sy?: number;
	em?: number;
	ey?: number;
	setSm?: Function;
	setSy?: Function;
	setEm?: Function;
	setEy?: Function;
	pre: string;
	setIndexForMv?: Function;
	index?: number;
	info: string;
}

export default function MemberAndValuation({
	data,
	record,
	changeData,
	setSm,
	setSy,
	setEm,
	setEy,
	pre,
	em,
	ey,
	sm,
	sy,
	setIndexForMv,
	index,
	info
}: MemberAndValuationProps) {
	const { childTab }: any = useContext(NWContext);
	const isListHolding: boolean = setSm && setSy ? false : true;
	const startMonth = isListHolding ? (childTab === TAB.PROP ? record.purchase.month : record.sm) : sm;
	const startYear = isListHolding ? (childTab === TAB.PROP ? record.purchase.year : record.sy) : sy;
	const endMonth = isListHolding ? record.em : em;
	const endYear = isListHolding ? record.ey : ey;

	const changeStartYear = (val: number) => {
		setSy && setSy(val);
		if (childTab === TAB.PROP) {
			record.purchase ? (record.purchase.year = val) : '';
			setIndexForMv && setIndexForMv(index);
		} else {
			hasOnlyEnddate(childTab) ? (record.subt === 'H' ? (record.ey = 0) : (record.ey = val)) : (record.sy = val);
		}
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	const changeStartMonth = (val: number) => {
		setSm && setSm(val);
		if (childTab === TAB.PROP) {
			record.purchase ? (record.purchase.month = val) : '';
			setIndexForMv && setIndexForMv(index);
		} else {
			hasOnlyEnddate(childTab) ? (record.subt === 'H' ? (record.em = 0) : (record.em = val)) : (record.sm = val);
		}
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	const changeEndYear = (val: number) => {
		setEy && setEy(val);
		record.ey = val;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	const changeEndMonth = (val: number) => {
		setEm && setEm(val);
		record.em = val;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	useEffect(
		() => {
			if (record.subt === NATIONAL_SAVINGS_CERTIFICATE) {
				const { month, year } = calculateAddYears(record.sm as number, record.sy as number, 5);
				record.em = month;
				record.ey = year;
			}
		},
		[ record ]
	);

	return (
		<DateInput
			title={pre}
			info={info}
			startMonthHandler={changeStartMonth}
			startYearHandler={changeStartYear}
			endMonthHandler={isRangePicker(childTab, record.subt as string) ? changeEndMonth : undefined}
			endYearHandler={isRangePicker(childTab, record.subt as string) ? changeEndYear : undefined}
			startMonthValue={hasOnlyEnddate(childTab) && isListHolding ? endMonth as number : startMonth as number}
			endMonthValue={endMonth as number}
			startYearValue={hasOnlyEnddate(childTab) && isListHolding ? endYear as number : startYear as number}
			endYearValue={endYear as number}
			dateWithEnddate={hasOnlyEnddate(childTab) ? true : false}
			size="middle"
		/>
	);
}
