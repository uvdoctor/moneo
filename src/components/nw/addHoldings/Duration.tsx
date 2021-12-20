import { Col } from 'antd';
import React from 'react';
import DatePickerInput from '../../form/DatePickerInput';
import SelectInput from '../../form/selectinput';

interface DurationProps {
	value: number;
	start: any;
	changeHandler: Function;
	option?: any;
    endChangeHandler?: Function;
}

export default function Duration({ value, changeHandler, option, start, endChangeHandler }: DurationProps) {
	return (
		<Col>
			{option ? (
				<SelectInput pre={''} value={value} options={option} changeHandler={changeHandler} />
			) : (
				<DatePickerInput
					isRangePicker={true}
					title={''}
					changeHandler={changeHandler}
                    setEnddate={endChangeHandler}
					enddate={value}
					value={start}
					picker='month'
				/>
			)}
		</Col>
	);
}
