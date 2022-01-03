import React, { Fragment, useContext, useState } from 'react';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import NumberInput from '../form/numberinput';
import { toHumanFriendlyCurrency, toStringArr } from '../utils';
import { GoalContext } from './GoalContext';
import AnnualCF from './AnnualCF';
import { Tabs } from 'antd';
import { CalcContext } from '../calc/CalcContext';

export default function SellAsset() {
	const { currency }: any = useContext(CalcContext);
	const { sellPrice, assetChgRate, setAssetChgRate, sellAfter, setSellAfter }: any = useContext(GoalContext);
	const [
		tabIndex,
		setTabIndex
	] = useState<number>(0);
	const { TabPane } = Tabs;

	return (
		<Fragment>
			<Section title="Sell Details">
				<RadialInput
					info="Years after which You Plan to Sell this Purchase."
					label="Years"
					pre="Sell After"
					labelBottom={true}
					data={toStringArr(3, 30)}
					value={sellAfter}
					step={1}
					changeHandler={setSellAfter}
				/>
				<NumberInput
							info="Rate at which Price may change yearly."
							pre="Yearly price change"
							unit="%"
							post={`Sell price ${toHumanFriendlyCurrency(sellPrice, currency)}`}
							min={-20}
							max={20}
							step={0.5}
							value={assetChgRate}
							changeHandler={setAssetChgRate}
						/>
			</Section>
			<Tabs onTabClick={(key: string) => setTabIndex(parseInt(key))} defaultActiveKey={'' + tabIndex} type="card">
				<TabPane key={0} tab="Yearly Cost">
					{tabIndex === 0 && <AnnualCF />}
				</TabPane>
				<TabPane key={1} tab="Yearly Income">
					{tabIndex === 1 && <AnnualCF income />}
				</TabPane>
			</Tabs>
		</Fragment>
	);
}
