import { Tabs } from 'antd';
import React, { useContext, useState } from 'react';
import { CalcContext } from '../calc/CalcContext';
import Care from './Care';
import FIBenefit from './FIBenefit';
import FIMoneyOutflow from './FIMoneyOutflow';

export default function FIAdvanced() {
    const { TabPane } = Tabs;
    const { currency }: any = useContext(CalcContext);
    const [
		tabIndex,
		setTabIndex
	] = useState<number>(0);

    return (
            <Tabs onTabClick={(key: string) => setTabIndex(parseInt(key))} defaultActiveKey={'' + tabIndex} type="card">
                <TabPane key={0} tab="Inflow">
                    <FIBenefit />
                </TabPane>
                <TabPane key={1} tab="Outflow">
                    <FIMoneyOutflow />
                </TabPane>
                {(currency === "USD" || currency === "CAD" || currency === "GBP") ?
                    <TabPane key={2} tab="Care">
                    <Care />
                    </TabPane>
                : null}
            </Tabs>
    );
}