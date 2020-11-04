import { Tabs } from 'antd';
import React, { useState } from 'react';
import DynamicTargetInput from '../form/DynamicTargetInput';
import Section from '../form/section';

export default function Expect() {
	const [ tabIndex, setTabIndex ] = useState<number>(0);
	const { TabPane } = Tabs;

	return (
		<Section title="Money Expected in Future (eg: due to Inheritance, Selling Investments, etc.)" footer={`${tabIndex === 1 ? "Include" : "Exclude"} Taxes & Fees.`}>
			<Tabs onTabClick={(key: string) => setTabIndex(parseInt(key))} defaultActiveKey={'' + tabIndex} type="card">
				<TabPane key={0} tab="Gains">
					{tabIndex === 0 && <DynamicTargetInput />}
				</TabPane>
				<TabPane key={1} tab="Losses">
					{tabIndex === 1 && <DynamicTargetInput lossInput />}
				</TabPane>
			</Tabs>
		</Section>
	);
}
