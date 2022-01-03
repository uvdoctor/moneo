import React from 'react';
import { getRiskProfileOptions, getTaxLiabilityOptions, toStringArr } from './utils';
import SelectInput from './form/selectinput';
import DatePickerInput from './form/DatePickerInput';
import RadialInput from './form/radialinput';
import { Col, Row } from 'antd';

interface StepTwoProps {
	riskProfile: string;
	setRiskProfile: Function;
	taxLiability: string;
	setTaxLiability: Function;
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
			<Col span={24}>
				<SelectInput
					info="How much Risk are You willing to take in order to achieve higher Investment Return?"
					pre="Can Tolerate"
					unit="Loss"
					value={props.riskProfile}
					changeHandler={props.setRiskProfile}
					options={getRiskProfileOptions()}
				/>
			</Col>
			<Col span={24}>
				<SelectInput
					info="How much do you earn in a year?"
					pre="Yearly Income"
					value={props.taxLiability}
					changeHandler={props.setTaxLiability}
					options={getTaxLiabilityOptions()}
				/>
			</Col>
		</Row>
	);
}
