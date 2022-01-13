import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import DateInput from '../form/DateInput';

interface MemberAndValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function MemberAndValuation({ data, record, changeData }: MemberAndValuationProps) {
	const { childTab }: any = useContext(NWContext);
	const { LENT, LOAN, INS } = TAB;

	const isRangePicker = (childTab: string, subt?: string, chgF?: number) =>
		[ LENT ].includes(childTab) && subt !== NATIONAL_SAVINGS_CERTIFICATE && chgF !== 0;

	const changeStartYear = (val: number) => {
		hasOnlyEnddate(childTab) ? (record.ey = val) : (record.sy = val);
		changeData([ ...data ]);
	};

	const changeStartMonth = (val: number) => {
		hasOnlyEnddate(childTab) ? (record.em = val) : (record.sm = val);
		changeData([ ...data ]);
	};

	const changeEndYear = (val: number) => {
		record.ey = val;
		changeData([ ...data ]);
	};

	const changeEndMonth = (val: number) => {
		record.em = val;
		changeData([ ...data ]);
	};

	const hasOnlyEnddate = (childTab: string) =>
		[ LOAN, INS ].includes(childTab) || (record.chgF === 0 && childTab === LENT);

	return (
		<DateInput
			title={''}
			startMonthHandler={changeStartMonth}
			startYearHandler={changeStartYear}
			endMonthHandler={
				isRangePicker(childTab, record.subt as string, record.chgF as number) ? changeEndMonth : undefined
			}
			endYearHandler={
				isRangePicker(childTab, record.subt as string, record.chgF as number) ? changeEndYear : undefined
			}
			startMonthValue={hasOnlyEnddate(childTab) ? record.em as number : record.sm as number}
			endMonthValue={record.em as number}
			startYearValue={hasOnlyEnddate(childTab) ? record.ey as number : record.sy as number}
			endYearValue={record.ey as number}
			size="middle"
		/>
	);
}
