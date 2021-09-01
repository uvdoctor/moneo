import React, { Fragment, useContext, useEffect } from 'react';
import HoldingTabView from './HoldingTabView';
import HoldingsChart from './HoldingsChart';
import DataSwitcher from '../DataSwitcher';
import { NWContext } from './NWContext';
import { Button, Col, PageHeader, Row } from 'antd';
import SelectInput from '../form/selectinput';
import { SaveOutlined } from '@ant-design/icons';

import './nw.less';
import FamilyInput from './FamilyInput';
import ResultCarousel from '../ResultCarousel';
import TotalAssets from './TotalAssets';
import TotalNetWorth from './TotalNetWorth';
import TotalLiabilities from './TotalLiabilities';

export default function NWView() {
	const {
		results,
		setResults,
		selectedCurrency,
		setSelectedCurrency,
		loadingHoldings,
		currencyList
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(
		() => {
			if (!loadingHoldings)
				setResults([
					...[
						<TotalNetWorth />,
						<TotalAssets />,
						<TotalLiabilities />
					]
				]);
		},
		[ loadingHoldings ]
	);

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title="Real-time Analysis"
							extra={[
								<Button
									key="save"
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
							options={currencyList}
							loading={loadingHoldings}
						/>
					</Col>
				</Row>
			</div>
			<div className="nw-container">
				<ResultCarousel results={results} />
				<DataSwitcher title="Holdings details">
					<Chart>
						<HoldingsChart />
					</Chart>
					<DataSwitcherList>
						{!loadingHoldings ? <HoldingTabView /> : null}
					</DataSwitcherList>
				</DataSwitcher>
			</div>
		</Fragment>
	);
}
