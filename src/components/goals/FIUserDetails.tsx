import { Row, Col } from 'antd';
import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { toStringArr } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { getRAOptions } from './goalutils';

export default function FIUserDetails() {
	const { currency, startYear, setStartYear, eyOptions }: any = useContext(CalcContext);
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

	return (
		<Section title="Your Details" videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}>
			<SelectInput
				info="This is needed to find the earliest possible year for Your Financial Independence (FI) before You turn 70. In case it's not possible to achieve FI by 70 years of age, then You will be requested to reconsider Your inputs."
				pre="Birth Year"
				value={startYear}
				changeHandler={(val: string) => setStartYear(parseInt(val))}
				options={eyOptions}
			/>
			<NumberInput
				info={`Your Total Portfolio Value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc.`}
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
					/>
				</Col>
				<Col>
					<RadialInput
						pre="FI Target Age"
						label="Years"
						value={retirementAge}
						changeHandler={setRetirementAge}
						step={1}
						data={toStringArr(40, 70, 1)}
						labelBottom
					/>
				</Col>
			</Row>
		</Section>
	);
}
