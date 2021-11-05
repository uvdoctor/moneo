import React, { Fragment, useContext, useState } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import NumberInput from '../form/numberinput';
import { toStringArr } from '../utils';
import { GoalContext } from './GoalContext';
import AnnualCF from './AnnualCF';
import { Tabs } from 'antd';
import { CalcContext } from '../calc/CalcContext';

export default function SellAsset() {
	const {
		currency,
	}: any = useContext(CalcContext);
	const {
		sellPrice,
		assetChgRate,
		setAssetChgRate,
		sellAfter,
		setSellAfter,
	}: any = useContext(GoalContext);
	const [ tabIndex, setTabIndex ] = useState<number>(0);
	const { TabPane } = Tabs;

	return (
		<Fragment>
			<Section title="Sell Details">
				<NumberInput
					info="Rate at which Price may change Yearly."
					pre="Yearly Price Changes"
					unit="%"
					min={-20}
					max={20}
					step={0.5}
					value={assetChgRate}
					changeHandler={setAssetChgRate}
				/>
				<RadialInput
					info="Years after which You Plan to Sell this Purchase."
					label="Years"
					pre="Sell After"
					post={
						<ItemDisplay
							label="Sell Price"
							result={Math.round(sellPrice)}
							currency={currency}
							footer="after taxes & fees"
						/>
					}
					labelBottom={true}
					data={toStringArr(3, 30)}
					value={sellAfter}
					step={1}
					changeHandler={setSellAfter}
				/>
			</Section>
			<Tabs
				onTabClick={(key: string) => setTabIndex(parseInt(key))}
				defaultActiveKey={'' + tabIndex}
				type="card"
			>
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