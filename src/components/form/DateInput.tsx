import React from 'react';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import 'antd/lib/date-picker/style/index';
import { parse } from 'date-fns';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { RangeValue } from 'rc-picker/lib/interface';
import { getMonthName } from '../utils';
import LabelWithTooltip from './LabelWithTooltip';

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
const { RangePicker } = DatePicker;
interface DateInputProps {
	className?: string;
	title: string;
	startDateHandler?: Function;
	startMonthHandler?: Function;
	startYearHandler: Function;
	endDateHandler?: Function;
	endMonthHandler?: Function;
	endYearHandler?: Function;
	startMonthValue?: number;
	endMonthValue?: number;
	startYearValue: number;
	endYearValue?: number;
	startDateValue?: number;
	endDateValue?: number;
	size?: SizeType;
	info?: string;
	disabled?: boolean;
	initialValue?: number;
}

export default function DateInput({
	className,
	title,
	startDateHandler,
	startMonthHandler,
	startYearHandler,
	endDateHandler,
	endMonthHandler,
	endYearHandler,
	startMonthValue,
	endMonthValue,
	startYearValue,
	endYearValue,
	startDateValue,
	endDateValue,
	size,
	info,
	disabled,
	initialValue
}: DateInputProps) {
	const today = new Date();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();
	const getTodayDate = (num: number) => `${year - num}-${month}-${today.getDate()}`;
	const getMonthDate = () => `Apr-${year - 5}`;
	const getMonthEndDate = () => `Mar-${year + 1}`;

	const data = {
		month: {
			format: 'MMM-yyyy',
			date: startMonthValue && startYearValue ? `${getMonthName(startMonthValue, true)}-${startYearValue}` : getMonthDate(),
			endDate: endMonthValue && endYearValue ? `${getMonthName(endMonthValue, true)}-${endYearValue}` : getMonthEndDate()
		},
		date: {
			format: 'yyyy-MM-dd',
			date:
				startMonthValue && startYearValue && startDateValue
					? `${startYearValue}-${startMonthValue}-${startDateValue}`
					: getTodayDate(20),
			endDate:
				endMonthValue && endYearValue && endDateValue
					? `${endYearValue}-${endMonthValue}-${endDateValue}`
					: getTodayDate(0)
		},
		year: {
			format: 'yyyy',
			date: startYearValue ? startYearValue : year - 20,
			endDate: endYearValue ? endYearValue : year + 1
		}
	};

	const picker = startDateHandler ? 'date' : startMonthHandler ? 'month' : 'year';
	const { format, date, endDate } = data[picker];

	return (
		<>
			<div className={className ? className : 'date'}><LabelWithTooltip label={title} info={info} /></div>
			<span>
				{(endMonthHandler || endYearHandler || endDateHandler) ? (
					<RangePicker
						picker={picker}
						size={size ? size : 'middle'}
						defaultValue={[ parse(date as string, format, today), parse(endDate as string, format, today) ]}
						format={format}
						onChange={(values: RangeValue<Date> | null) => {
							const start = values?.[0];
							const end = values?.[1];
							if(start && end ) {
								startYearHandler(start.getFullYear());
								endYearHandler && endYearHandler(end.getFullYear());
								startMonthHandler && startMonthHandler(start.getMonth()+1);
								endMonthHandler && endMonthHandler(end.getMonth()+1);
								startDateHandler && startDateHandler(end.getDate());
								endDateHandler && endDateHandler(end.getDate());
							}
						}}
						disabled={disabled}
						disabledDate={(date: Date)=> !date || (initialValue ? date.getFullYear() < initialValue : false)}
					/>
				) : (
					<DatePicker
						picker={picker}
						size={size ? size : 'large'}
						defaultValue={parse(date as string, format, new Date())}
						format={format}
						onChange={(value: Date | null) => {
							if (!value) return;
							startDateHandler && startDateHandler(value?.getDate())
							startMonthHandler && startMonthHandler(value?.getMonth()+1)
							startYearHandler && startYearHandler(value?.getFullYear())
						}}
						disabled={disabled}
						// @ts-ignore
						disabledDate={(date: Date) => {
							if(!date) return;
							if(initialValue && date.getFullYear() < initialValue) return true;
						}}
					/>
				)}
			</span>
		</>
	);
}
