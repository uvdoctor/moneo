import { Tabs } from 'antd';
import React, { useContext, useState } from 'react';
import { GoalType } from '../../api/goals';
import AnnualCF from '../goals/AnnualCF';
import { CalcContext } from './CalcContext';
import TaxAdjustment from './TaxAdjustment';

export default function Advanced() {
    const { goal }: any = useContext(CalcContext);
    const { TabPane } = Tabs;
    const [
		tabIndex,
		setTabIndex
	] = useState<number>(0);
    return (
        goal.type !== GoalType.B ? 
            <TaxAdjustment />
        : 
            <Tabs onTabClick={(key: string) => setTabIndex(parseInt(key))} defaultActiveKey={'' + tabIndex} type="card">
                <TabPane key={0} tab="Tax">
                    <TaxAdjustment />
                </TabPane>
                <TabPane key={1} tab="Other">
                    <></>
                        <AnnualCF />
                        <AnnualCF income />
                </TabPane>
            </Tabs>
    )
}