import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { Col, Row } from 'antd';
import { NWContext } from './NWContext';
import { AppContext } from '../AppContext';

export default function HoldingsResult() {
    const { nw, totalAssets, totalLiabilities }: any = useContext(NWContext);
	const { defaultCurrency }: any = useContext(AppContext);

	return (
		<Row align="middle" justify="space-between">
			<Col className="dd-stat" span={6}>
				<ItemDisplay label="Net Worth" result={nw} currency={defaultCurrency} pl />
			</Col>
			<Col span={2}>Equals</Col>
			<Col className="dd-stat" span={6}>
				<ItemDisplay label="You Own" result={totalAssets} currency={defaultCurrency} pl />
			</Col>
			<Col span={2}>Minus</Col>
			<Col className="dd-stat" span={6}>
				<ItemDisplay label="You Owe" result={totalLiabilities} currency={defaultCurrency} pl />
			</Col>
		</Row>
	);
}
