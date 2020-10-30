import React, { useContext, useEffect, useState } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import SVGMoneyBag from '../calc/svgmoneybag';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import NumberInput from '../form/numberinput';
import { toStringArr } from '../utils';
import { calculateSellPrice, calculateXIRR } from './cfutils';
import { getDuration } from './goalutils';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { GoalContext } from './GoalContext';
import { Col, Row } from 'antd';

export default function Sell() {
	const {
		price,
		sellPrice,
		setSellPrice,
		assetChgRate,
		setAssetChgRate,
		startYear,
		endYear,
		sellAfter,
		setSellAfter,
		currency,
		cfs
	}: any = useContext(GoalContext);
	const [ annualReturnPer, setAnnualReturnPer ] = useState<number | null>(0);

	useEffect(
		() => {
			let duration = getDuration(sellAfter, startYear, endYear, 0, null, null, null);
			let sellPrice = calculateSellPrice(price, assetChgRate, duration);
			setSellPrice(sellPrice);
			setAnnualReturnPer(calculateXIRR(cfs, startYear, price, sellAfter, sellPrice));
		},
		[ cfs ]
	);

	return (
		<Section title="Sell Details" footer="Sell Price above excludes taxes & fees.">
			<NumberInput
				info="Rate at which Price may change Yearly."
				pre="Asset Value Changes Yearly by"
				unit="%"
				min={-20}
				max={20}
				step={0.5}
				value={assetChgRate}
				changeHandler={setAssetChgRate}
				note={
					annualReturnPer && (
						<ItemDisplay
							svg={annualReturnPer > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
							label={`Annualized ${annualReturnPer > 0 ? 'Gain' : 'Lose'}`}
							result={annualReturnPer}
							decimal={2}
							unit="%"
							pl
						/>
					)
				}
			/>
						<Row align="middle" justify="space-between">
				<Col>
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
				</Col>
				<Col>
					<ItemDisplay
						svg={<SVGMoneyBag disabled={false} selected />}
						label="You May Get"
						footer={`In ${startYear + sellAfter}`}
						result={Math.round(sellPrice)}
						currency={currency}
					/>
				</Col>
			</Row>
		</Section>
	);
}
