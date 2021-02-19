import React, { useState } from 'react';
import AAPlanChart from './AAPlanChart';
import AssetAllocationChart from './AssetAllocationChart';
import { Tabs } from 'antd';

export default function DynamicAAChart() {
	const [ showSingleYear, setShowSingleYear ] = useState<number | null>(null);

	const showAAPlan = () => setShowSingleYear(null);

	const { TabPane } = Tabs;

	return (
		<Tabs centered tabBarStyle={{backgroundColor: '#fff'}}>
			<TabPane key={'1'} tab={`${new Date().getFullYear()}`}>
				<AssetAllocationChart />
			</TabPane>
			<TabPane key={'2'} tab={`${new Date().getFullYear() + 1} Onwards`}>
				{showSingleYear ? (
					<AssetAllocationChart year={showSingleYear} backFunction={showAAPlan} />
				) : (
					<AAPlanChart changeToSingleYear={setShowSingleYear} />
				)}
			</TabPane>
		</Tabs>
	);
}
