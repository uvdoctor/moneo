import React, { useEffect, useState } from 'react';
import { toStringArr } from './utils';
import DateInput from './form/DateInput';
import RadialInput from './form/radialinput';
import { Col, Row } from 'antd';

interface StepTwoProps {
	setDOB: Function;
	lifeExpectancy: number;
	setLifeExpectancy: Function;
}

export default function StepTwo({ setDOB, lifeExpectancy, setLifeExpectancy }: StepTwoProps) {
	const [ date, setDate ] = useState<number>(1);
	const [ month, setMonth ] = useState<number>(1);
	const [ year, setYear ] = useState<number>(2000);

	useEffect(
		() => {
			const getStr = (num: number) => (num < 10 ? `0${num}` : '' + num);
			setDOB(`${year}-${getStr(month)}-${getStr(date)}`);
		},
		[ date, month, year ]
	);

	return (
		<Row gutter={[ 8, 16 ]}>
			<Col span={24}>
				<DateInput
					title={'Date of Birth'}
					startYearHandler={setYear}
					startDateHandler={setDate}
					startMonthHandler={setMonth}
					startYearValue={year}
					startMonthValue={month}
					startDateValue={date}
					size="middle"
				/>
			</Col>
			<Col span={24}>
				<RadialInput
					pre="Life Expectancy"
					label="Years"
					value={lifeExpectancy}
					changeHandler={setLifeExpectancy}
					step={1}
					data={toStringArr(70, 100, 1)}
					labelBottom
					info="This will be used to define the duration for which Financial Planning is Needed."
				/>
			</Col>
		</Row>
	);
}
