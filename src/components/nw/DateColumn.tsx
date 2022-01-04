import { Col } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import { calculateAddYears, calculateDifferenceInYears } from './valuationutils';
import DateInput from '../form/DateInput';

interface MemberAndValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function MemberAndValuation({ data, record, changeData }: MemberAndValuationProps) {
	const { childTab }: any = useContext(NWContext);
	const { LENT, VEHICLE, LOAN, INS } = TAB;
	const [ duration, setDuration ] = useState<number>(
		calculateDifferenceInYears(record.em as number, record.ey as number, record.sm as number, record.sy as number)
	);

	const changeDuration = (val: number) => {
		setDuration(val);
		const { year, month } = calculateAddYears(record.sm as number, record.sy as number, duration);
		record.em = month;
		record.ey = year;
		changeData([ ...data ]);
	};

	const changeStartYear = (val: number) => {
		record.sy = val;
		changeData([ ...data ]);
	};

	const changeStartMonth = (val: number) => {
		record.sm = val;
		changeData([ ...data ]);
	};

	const changeEndYear = (val: number) => {
		record.ey = val;
		changeData([ ...data ]);
	};

	const changeEndMonth = (val: number) => {
		console.log(record);
		record.em = val;
		changeData([ ...data ]);
	};

	const hasRangePicker = (childTab: string) => [ LENT ].includes(childTab);

	const hasDate = (childTab: string) => [ VEHICLE, LENT, LOAN, INS ].includes(childTab);

	return (
		<Fragment>
			<Col>
				{hasDate(childTab) && (
					<DateInput
						title={''}
						startMonthHandler={changeStartMonth}
						startYearHandler={changeStartYear}
						endMonthHandler={
							hasRangePicker(childTab) && record.subt !== NATIONAL_SAVINGS_CERTIFICATE ? (
								changeEndMonth
							) : (
								undefined
							)
						}
						endYearHandler={
							hasRangePicker(childTab) && record.subt !== NATIONAL_SAVINGS_CERTIFICATE ? (
								changeEndYear
							) : (
								undefined
							)
						}
						startMonthValue={record.sm as number}
						endMonthValue={record.em as number}
						startYearValue={record.sy as number}
						endYearValue={record.ey as number}
						size="middle"
					/>
				)}
			</Col>
			{record.subt === NATIONAL_SAVINGS_CERTIFICATE && (
				<Col>
					<SelectInput
						pre={''}
						value={duration}
						changeHandler={(val: number) => changeDuration(val)}
						options={{ 5: 'Five Years', 10: 'Ten Years' }}
					/>
				</Col>
			)}
		</Fragment>
	);
}
