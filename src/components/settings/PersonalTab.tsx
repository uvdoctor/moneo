import { Col, Row } from 'antd';
import React from 'react';
import TextInput from '../form/textinput';
import DateInput from '../form/DateInput';
import RadialInput from '../form/radialinput';
import { toStringArr } from '../utils';
import { COLORS } from '../../CONSTANTS';
import ImageInput from './ImageInput';

interface PersonalTabProps {
	name: string;
	lastName: string;
	dispatch: Function;
	dobDate: number;
	dobMonth: number;
	dobYear: number;
	lifeExpectancy: number;
	user: any;
}

export default function PersonalTab({
	name,
	lastName,
	dobDate,
	dobMonth,
	dobYear,
	dispatch,
	lifeExpectancy,
	user
}: PersonalTabProps) {
	return (
		<Row gutter={[ 32, 20 ]}>
			<Col className="personal-tabpane-image-view">
				<ImageInput user={user} />
			</Col>
			<Col xs={24} sm={24} md={12}>
		<Row gutter={[ { xs: 0, sm: 0, md: 35 }, { xs: 15, sm: 15, md: 15 } ]}>
			<Col xs={24} md={12}>
				<TextInput
					pre="First Name"
					placeholder="Name"
					value={name}
					changeHandler={(val: any) =>
						dispatch({
							type: 'single',
							data: { field: 'name', val }
						})}
					minLength={2}
					maxLength={20}
					setError={(val: any) =>
						dispatch({
							type: 'single',
							data: { field: 'error', val }
						})}
					fieldName="firstname"
					pattern="^[a-zA-Z'-.,]+$"
					style={{ width: 250 }}
				/>
			</Col>
			<Col xs={24} md={12}>
				<TextInput
					pre="Last Name"
					placeholder="Last Name"
					value={lastName}
					changeHandler={(val: any) =>
						dispatch({
							type: 'single',
							data: { field: 'lastName', val }
						})}
					minLength={2}
					maxLength={20}
					setError={(val: any) =>
						dispatch({
							type: 'single',
							data: { field: 'error', val }
						})}
					fieldName="lastname"
					pattern="^[a-zA-Z'-.,]+$"
					style={{ width: 250 }}
				/>
			</Col>
			{dobDate ? (
				<Col xs={24} md={12}>
					<DateInput
						title="Date of birth"
						className="dob"
						startDateValue={dobDate}
						startMonthValue={dobMonth}
						startYearValue={dobYear}
						startYearHandler={(val: number) =>
							dispatch({
								type: 'single',
								data: { field: 'dobYear', val }
							})}
						startMonthHandler={(val: number) =>
							dispatch({
								type: 'single',
								data: { field: 'dobMonth', val }
							})}
						startDateHandler={(val: number) =>
							dispatch({
								type: 'single',
								data: { field: 'dobDate', val }
							})}
						size="large"
					/>
				</Col>
			) : null}

			<Col xs={24} md={12}>
				<RadialInput
					pre="Life Expectancy"
					label="Years"
					value={lifeExpectancy}
					changeHandler={(val: number) =>
						dispatch({
							type: 'single',
							data: { field: 'lifeExpectancy', val }
						})}
					step={1}
					data={toStringArr(70, 100, 1)}
					labelBottom
					trackColor={COLORS.WHITE}
					info="This will be used to define the duration for which Financial Planning is Needed."
				/>
			</Col>
		</Row>
		</Col>
		</Row>
	);
}
