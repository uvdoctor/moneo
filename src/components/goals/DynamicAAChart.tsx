import React, { useState } from 'react';
import AAPlanChart from './AAPlanChart';
import AssetAllocationChart from './AssetAllocationChart';
import { Tabs } from 'antd';
import HSwitch from '../HSwitch';

export default function DynamicAAChart() {
	const [ showSingleYear, setShowSingleYear ] = useState<number>(0);
	const { TabPane } = Tabs;
	const [ activeTab, setActiveTab ] = useState<string>('1');

	return (
		<Tabs
			centered
			tabBarStyle={{ backgroundColor: '#fff' }}
			onChange={(key: string) => setActiveTab(key)}
			tabBarExtraContent={
				<HSwitch
					rightText="Show Single Year"
					value={showSingleYear}
					setter={setShowSingleYear}
					disabled={activeTab === '1'}
				/>
			}
		>
			<TabPane key={'1'} tab={`${new Date().getFullYear()}`}>
				<AssetAllocationChart />
			</TabPane>
			<TabPane key={'2'} tab={`${new Date().getFullYear() + 1} Onwards`}>
				{showSingleYear ? <AssetAllocationChart yearChangeable /> : <AAPlanChart />}
			</TabPane>
		</Tabs>
	);
}
