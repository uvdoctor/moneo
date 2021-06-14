import React, { Fragment, useContext, useEffect } from 'react';
import HoldingTabs from './HoldingTabs';
import HoldingsChart from './HoldingsChart';
import SearchFilter from './SearchFilter';
import DataSwitcher from '../DataSwitcher';
import { NWContext } from './NWContext';
import HoldingsResult from './HoldingsResult';
import { Button, Col, PageHeader, Row } from 'antd';
import SelectInput from '../form/selectinput';
import { SaveOutlined } from '@ant-design/icons';

import './nw.less';
import FamilyInput from './FamilyInput';

export default function HoldingsDetails() {
	const {
		holdingsResult,
		setHoldingsResult,
		selectedCurrency,
		setSelectedCurrency,
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(() => {
		setHoldingsResult(<HoldingsResult />);
	}, []);

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title="Financial Diagnosis"
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
		</Fragment>
	);
}
