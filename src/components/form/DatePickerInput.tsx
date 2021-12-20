import React from 'react';
import { Row, Col } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import 'antd/lib/date-picker/style/index';
import { parse } from 'date-fns';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
const { RangePicker } = DatePicker;
interface DatePickerInputProps {
	className?: string;
	title: string;
	value: any;
	changeHandler: Function;
	width?: any;
	picker?: any;
	size?: SizeType;
	isRangePicker?: boolean;
	setEnddate?: Function;
	enddate?: any;
}

export default function DatePickerInput(props: DatePickerInputProps) {
	const getTodayDate = (num: number) => {
		const today = new Date();
		return `${today.getFullYear() - num}-${today.getMonth() + 1}-${today.getDate()}`;
	};

	const getMonthDate = () => `Apr-${new Date().getFullYear() - 5}`;
	const getMonthEndDate = () => `Mar-${new Date().getFullYear() + 1}`;

	const dateFormat = props.picker === 'month' ? 'MMM-yyyy' : props.picker === 'year' ? 'yyyy' : 'yyyy-MM-dd';
	const defaultDate = props.picker === 'month' ? getMonthDate() : props.picker === 'year' ? '2000' : getTodayDate(20);
	const defaultEnddate =
		props.picker === 'month' ? getMonthEndDate() : props.picker === 'year' ? '2022' : getTodayDate(0);

	const date = props.value ? props.value : defaultDate;
	const endDate = props.enddate ? props.enddate : defaultEnddate;

	return (
		<Row gutter={[ 10, 0 ]}>
			{props.title && <Col className={props.className || 'date'}>{props.title}</Col>}
			{props.isRangePicker ? (
				<Col>
					<RangePicker
						// value to be used as startdate
						picker={props.picker ? props.picker : 'date'}
						size={props.size ? props.size : 'middle'}
						defaultValue={[ parse(date, dateFormat, new Date()), parse(endDate, dateFormat, new Date()) ]}
						format={dateFormat}
						onChange={(_, ds) => {
							const [ start, end ] = ds.toString().split(',');
							props.changeHandler(start);
							props.setEnddate && props.setEnddate(end);
						}}
					/>
				</Col>
			) : (
				<Col>
					<DatePicker
						picker={props.picker ? props.picker : 'date'}
						size={props.size ? props.size : 'large'}
						defaultValue={parse(date, dateFormat, new Date())}
						format={dateFormat}
						onChange={(_, ds) => props.changeHandler(ds.toString())}
					/>
				</Col>
			)}
		</Row>
	);
}
