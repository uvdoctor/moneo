import { Row, Col } from 'antd';
import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { initOptions, toStringArr } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { getRAOptions } from './goalutils';

export default function FIUserDetails() {
	const { currency, setCurrency, startYear, changeStartYear }: any = useContext(CalcContext);
	const {
		nw,
		setNW,
		riskProfile,
		setRiskProfile,
		planDuration,
		setPlanDuration,
		retirementAge,
		setRetirementAge
	}: any = useContext(FIGoalContext);
	const nowYear = new Date().getFullYear();

	return (
		<Section title="Your Details" videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}>
			<SelectInput
				info="Your birth year is used to calculate the duration for which Financial Planning is needed."
				pre="Birth Year"
				value={startYear}
				changeHandler={changeStartYear}
				options={initOptions(nowYear - 60, 45)}
			/>
			<SelectInput pre="Currency" value={currency} changeHandler={setCurrency} currency />
			<NumberInput
				info={`Your Total Portfolio Value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc. Please do NOT include Your Home in the Investment Portfolio.`}
				value={nw}
				pre="Total"
				min={5000}
				max={900000}
				post="Portfolio"
				changeHandler={setNW}
				step={1000}
				currency={currency}
			/>
			<SelectInput
				info="How much Risk are You willing to take in order to achieve higher Investment Return?"
				pre="Can Tolerate"
				unit="Loss"
				value={riskProfile}
				changeHandler={setRiskProfile}
				options={getRAOptions()}
			/>
			<Row justify="space-between">
				<Col>
					<RadialInput
						pre="Assume Lifespan of"
						label="Years"
						value={planDuration}
						changeHandler={setPlanDuration}
						step={1}
						data={toStringArr(70, 100, 1)}
						labelBottom
						info="This will be used to define the duration for which Financial Planning is Needed."
					/>
				</Col>
				<Col>
					<RadialInput
						pre="FI Target Age"
						label="Years"
						value={retirementAge}
						changeHandler={setRetirementAge}
						step={1}
						data={toStringArr(40, 67, 1)}
						labelBottom
						info="This is the age by which You wish to achieve Financial Independence (FI)."
					/>
				</Col>
			</Row>
		</Section>
	);
}
