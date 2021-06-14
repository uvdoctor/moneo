import React, { Fragment, useContext, useEffect } from 'react';
import HoldingTabs from './HoldingTabs';
import HoldingsChart from './HoldingsChart';
import SearchFilter from './SearchFilter';
import DataSwitcher from '../DataSwitcher';
import { NWContext } from './NWContext';
import { Button, Col, PageHeader, Row } from 'antd';
import SelectInput from '../form/selectinput';
import { SaveOutlined } from '@ant-design/icons';

import './nw.less';
import FamilyInput from './FamilyInput';
import ItemDisplay from '../calc/ItemDisplay';
import ResultCarousel from '../ResultCarousel';

export default function HoldingsDetails() {
	const {
		results,
		setResults,
		selectedCurrency,
		setSelectedCurrency,
		nw, totalAssets, totalLiabilities
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(() => {
		setResults([...[
			<ItemDisplay label="Net Worth" result={nw} currency={selectedCurrency} pl />,
			<ItemDisplay label="You Own" result={totalAssets} currency={selectedCurrency} pl />,
			<ItemDisplay label="You Owe" result={totalLiabilities} currency={selectedCurrency} pl />
		]]);
	}, []);

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title="Real-time Analysis"
							extra={[
								<Button
									icon={<SaveOutlined />}
									onClick={() => {}}
									size="large"
									className="steps-start-btn"
								>
									Save
								</Button>
							]}
						/>
					</Col>
				</Row>
				<Row justify="space-between" align="middle" className="secondary-header">
					<Col>
						<FamilyInput />
					</Col>
					<Col>
						<SelectInput
							pre="Currency"
							value={selectedCurrency}
							changeHandler={setSelectedCurrency}
							currency
						/>
					</Col>
				</Row>
			</div>
			<div className="nw-container">
				<ResultCarousel results={results} />
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
		</Fragment>
	);
}
