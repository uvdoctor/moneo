import React from 'react';
import { toStringArr } from './utils';
import DatePickerInput from './form/DatePickerInput';
import RadialInput from './form/radialinput';
import { Col, Row } from 'antd';

interface StepTwoProps {
	DOB: string;
	setDOB: Function;
	lifeExpectancy: number;
	setLifeExpectancy: Function;
}

export default function StepTwo(props: StepTwoProps) {
	return (
		<Row gutter={[ 8, 16 ]}>
			<Col span={24}>
				<DatePickerInput title="Date of Birth" value={props.DOB} changeHandler={props.setDOB} size="middle" />
			</Col>
			<Col span={24}>
				<RadialInput
					pre="Life Expectancy"
					label="Years"
					value={props.lifeExpectancy}
					changeHandler={props.setLifeExpectancy}
					step={1}
					data={toStringArr(70, 100, 1)}
					labelBottom
					info="This will be used to define the duration for which Financial Planning is Needed."
				/>
			</Col>
		</Row>
	);
}
