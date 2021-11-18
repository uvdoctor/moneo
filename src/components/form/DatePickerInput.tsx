import React, { Fragment } from 'react';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import 'antd/lib/date-picker/style/index';
import { parse } from 'date-fns';
import { SizeType } from 'antd/lib/config-provider/SizeContext'

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

export default function TextInput(props: DatePickerInputProps) {
	const getTodayDate = () => {
		const today = new Date();
		return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
	};

	const dateFormat = props.picker === 'month' ? 'yyyy-MM' : props.picker === 'year' ? 'yyyy' : 'yyyy-MM-dd';

	return (
		<Fragment>
			<label className={props.className || 'date'}>{props.title}</label>
			<DatePicker
				picker={props.picker ? props.picker : 'date'}
				style={{ width: props.width ? props.width : 200 }}
                size={props.size ? props.size : "large"}
				defaultValue={parse(props.defaultVal || getTodayDate(), dateFormat, new Date())}
				format={dateFormat}
				onChange={(_, ds) => props.changeHandler(ds.toString())}
			/>
		</Fragment>
	);
}
