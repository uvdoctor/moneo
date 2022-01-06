import { Tabs } from 'antd';
import React, { useContext, useState } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import Care from './Care';
import FIBenefit from './FIBenefit';
import { FIGoalContext } from './FIGoalContext';
import FIMoneyOutflow from './FIMoneyOutflow';
import { PlanContext } from './PlanContext';

export default function FIAdvanced() {
	const { TabPane } = Tabs;
	const { isPublicCalc, dr, setDR }: any = useContext(PlanContext);
	const { currency }: any = useContext(CalcContext);
	const {
		emergencyFundChgRate,
		setEmergencyFundChgRate,
		taxRate,
		setTaxRate
	}: any = useContext(FIGoalContext);
	const [
		tabIndex,
		setTabIndex
	] = useState<number>(0);

	return (
		<Tabs onTabClick={(key: string) => setTabIndex(parseInt(key))} defaultActiveKey={'' + tabIndex} type="card">
			<TabPane key={0} tab="General">
				<Section title="General configuration">
					<NumberInput
						pre="Emergency fund increases"
						value={emergencyFundChgRate}
						changeHandler={setEmergencyFundChgRate}
						min={0}
						max={10}
						step={0.1}
						unit="% yearly"
						info="Emergency fund to be increased every year based on inflation."
					/>
					{isPublicCalc && (
						<NumberInput
							value={dr as number}
							changeHandler={setDR}
							min={0}
							max={10}
							step={0.1}
							pre="Investment earns"
							unit="% yearly"
							post="after taxes & fees"
						/>
					)}
					<NumberInput
						info="Applicable tax rate, in case you have to pay capital gains tax or income tax for withdrawing from retirement accounts beyond the allowed yearly limit."
						pre="Applicable tax rate"
						min={0}
						max={30}
						step={0.1}
						value={taxRate}
						changeHandler={setTaxRate}
						unit="%"
                        post="after achieving FI"
					/>
				</Section>
			</TabPane>
			<TabPane key={1} tab="Inflow">
				<FIBenefit />
			</TabPane>
			<TabPane key={2} tab="Outflow">
				<FIMoneyOutflow />
			</TabPane>
			{currency === 'USD' || currency === 'CAD' || currency === 'GBP' ? (
				<TabPane key={3} tab="Care">
					<Care />
				</TabPane>
			) : null}
		</Tabs>
	);
}