import React, { Fragment } from 'react';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import 'antd/lib/date-picker/style/index';
import { parse } from 'date-fns';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { getMonthName } from '../utils';

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

interface DatePickerInputProps {
	className?: string;
	title: string;
	defaultVal?: any;
	changeHandler: Function;
	width?: any;
	picker?: any;
	size?: SizeType;
}

export default function DatePickerInput(props: DatePickerInputProps) {
	const getTodayDate = () => {
		const today = new Date();
		return `${today.getFullYear() - 20}-${getMonthName(today.getMonth() + 1,true)}-${today.getDate()}`;
	};

	const getMonthDate = () => `Apr-${new Date().getFullYear() - 5}`;

	const dateFormat = props.picker === 'month' ? 'MMM-yyyy' : props.picker === 'year' ? 'yyyy' : 'yyyy-MMM-dd';
	const defaultDate = props.picker === 'month' ? getMonthDate() : props.picker === 'year' ? '2000' : getTodayDate();

	return (
		<Fragment>
			<label className={props.className || 'date'}>{props.title}</label>
			<DatePicker
				picker={props.picker ? props.picker : 'date'}
				style={{ width: props.width ? props.width : 200 }}
				size={props.size ? props.size : 'large'}
				defaultValue={parse(props.defaultVal || defaultDate, dateFormat, new Date())}
				format={dateFormat}
				onChange={(_, ds) => props.changeHandler(ds.toString())}
			/>
		</Fragment>
	);
}
