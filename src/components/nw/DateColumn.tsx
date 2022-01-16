import React, { useContext, useEffect } from 'react';
import { HoldingInput } from '../../api/goals';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext } from './NWContext';
import DateInput from '../form/DateInput';
import { hasOnlyEnddate, isRangePicker } from './nwutils';
import { calculateAddYears } from './valuationutils';

interface MemberAndValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function MemberAndValuation({ data, record, changeData }: MemberAndValuationProps) {
	const { childTab }: any = useContext(NWContext);

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

	useEffect(() => {
		if(record.subt === NATIONAL_SAVINGS_CERTIFICATE) {
			const { month, year } = calculateAddYears(record.sm as number, record.sy as number, 5);
			record.em = month;
			record.ey = year;
		}
	}, [record])

	return (
		<DateInput
			title={''}
			startMonthHandler={changeStartMonth}
			startYearHandler={changeStartYear}
			endMonthHandler={
				isRangePicker(childTab, record.subt as string) ? changeEndMonth : undefined
			}
			endYearHandler={
				isRangePicker(childTab, record.subt as string) ? changeEndYear : undefined
			}
			startMonthValue={
				hasOnlyEnddate(childTab) ? record.em as number : record.sm as number
			}
			endMonthValue={record.em as number}
			startYearValue={hasOnlyEnddate(childTab) ? record.ey as number : record.sy as number}
			endYearValue={record.ey as number}
		/>
	);
}
