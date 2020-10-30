import React, { useContext, useEffect, useState } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
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
				labelBottom={true}
				data={toStringArr(3, 30)}
				value={sellAfter}
				step={1}
				changeHandler={setSellAfter}
			/>
			<Col span={24}>
				<Row justify="space-between" align="middle">
					<Col>
						<ItemDisplay
							label="You May Get"
							footer={`In ${startYear + sellAfter}`}
							result={Math.round(sellPrice)}
							currency={currency}
						/>
					</Col>
					{annualReturnPer && (
						<Col>
							<ItemDisplay
								svg={annualReturnPer > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
								label={`Annualized ${annualReturnPer > 0 ? 'Gain' : 'Loss'}`}
								result={annualReturnPer}
								decimal={2}
								unit="%"
								pl
							/>
						</Col>
					)}
				</Row>
			</Col>
		</Section>
	);
}
