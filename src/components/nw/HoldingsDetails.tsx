import React, { useContext, useEffect } from 'react';
import HoldingTabs from './HoldingTabs';
import HoldingsChart from './HoldingsChart';
import SearchFilter from './SearchFilter';
import DataSwitcher from '../DataSwitcher';

import './nw.less';
import { NWContext } from './NWContext';
import HoldingsResult from './HoldingsResult';
import { Col, Row } from 'antd';
import SelectInput from '../form/selectinput';

export default function HoldingsDetails() {
	const {
		holdingsResult,
		setHoldingsResult,
		selectedMember,
		selectedCurrency,
		setSelectedCurrency,
		setSelectedMember,
		allFamily
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(() => {
		setHoldingsResult(<HoldingsResult />);
	}, []);

	return (
		<div className="nw-container">
			<Row justify="space-around" align="middle">
				<Col>
					<SelectInput
						options={allFamily}
						pre="Show for"
						value={selectedMember}
						changeHandler={setSelectedMember}
					/>
				</Col>
				<Col>
					<SelectInput pre="Currency" value={selectedCurrency} changeHandler={setSelectedCurrency} currency />
				</Col>
			</Row>
			<p>&nbsp;</p>
			{holdingsResult}
			<p>&nbsp;</p>
			<DataSwitcher title={<h3>Holdings details</h3>}>
				<Chart>
					<HoldingsChart />
				</Chart>
				<DataSwitcherList>
					<SearchFilter />
					<HoldingTabs />
				</DataSwitcherList>
			</DataSwitcher>
		</div>
	);
}
