import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext } from './NWContext';
import DateInput from '../form/DateInput';
import { hasOnlyEnddate, isRangePicker } from './nwutils';

interface MemberAndValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function MemberAndValuation({ data, record, changeData }: MemberAndValuationProps) {
	const { childTab }: any = useContext(NWContext);

	const changeStartYear = (val: number) => {
		hasOnlyEnddate(childTab, record.chgF as number) ? (record.ey = val) : (record.sy = val);
		changeData([ ...data ]);
	};

	const changeStartMonth = (val: number) => {
		hasOnlyEnddate(childTab, record.chgF as number) ? (record.em = val) : (record.sm = val);
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
			startMonthValue={
				hasOnlyEnddate(childTab, record.chgF as number) ? record.em as number : record.sm as number
			}
			endMonthValue={record.em as number}
			startYearValue={hasOnlyEnddate(childTab, record.chgF as number) ? record.ey as number : record.sy as number}
			endYearValue={record.ey as number}
			size="middle"
		/>
	);
}
