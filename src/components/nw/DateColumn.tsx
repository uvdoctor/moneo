import { Col } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { getMonthIndex, getMonthName } from '../utils';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import { calculateAddYears, calculateDifferenceInYears } from './valuationutils';
import DatePickerInput from '../form/DatePickerInput';

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

	const changeEnddate = (val: any) => {
		record.ey = Number(val.substring(val.length - 4));
		record.em = getMonthIndex(val.substring(0, 3));
		changeData([ ...data ]);
	};

	const changeStartdate = (val: string) => {
		record.sy = Number(val.substring(val.length - 4));
		record.sm = getMonthIndex(val.substring(0, 3));
		changeData([ ...data ]);
	};

	const hasRangePicker = (childTab: string) => [ LENT, LOAN, INS ].includes(childTab);

	const hasDate = (childTab: string) => [ VEHICLE, LENT, LOAN, INS ].includes(childTab);

	return (
		<Fragment>
			<Col>
				{hasDate(childTab) && (
					<DatePickerInput
						isRangePicker={hasRangePicker(childTab) && record.subt !== NATIONAL_SAVINGS_CERTIFICATE}
						picker="month"
						title=""
						changeHandler={(val: string) => changeStartdate(val)}
						value={record.sm && record.sy && `${getMonthName(record.sm as number, true)}-${record.sy}`}
						enddate={record.em && record.ey && `${getMonthName(record.em as number, true)}-${record.ey}`}
						setEnddate={(val: string) => changeEnddate(val)}
						size={'middle'}
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
