import React, { Fragment, useContext } from 'react';
import HoldingTabView from './HoldingTabView';
import { ASSETS_VIEW, LIABILITIES_VIEW, NWContext } from './NWContext';
import { Col, PageHeader, Radio, Row, Skeleton } from 'antd';
import SelectInput from '../form/selectinput';

require('./nw.less');
import FamilyInput from './FamilyInput';
import TotalNetWorth from './TotalNetWorth';
import ItemDisplay from '../calc/ItemDisplay';

export default function NWView() {
	const {
		selectedCurrency,
		setSelectedCurrency,
		loadingHoldings,
		loadingFamily,
		currencyList,
		totalAssets,
		totalLiabilities,
		view,
		setView
	}: any = useContext(NWContext);

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title="Real-time Analysis"
							extra={[
								<SelectInput
									key="currency"
									pre=""
									value={selectedCurrency}
									changeHandler={setSelectedCurrency}
									options={currencyList}
									loading={loadingHoldings}
								/>
							]}
						/>
					</Col>
				</Row>
				<Row justify="center" align="middle" className="secondary-header">
					<Col>
						<FamilyInput />
					</Col>
				</Row>
			</div>
			<div className="nw-container">
				{!loadingHoldings && !loadingFamily ? (
					<Fragment>
						<TotalNetWorth />
						<Row justify="center">
							<Radio.Group value={view} onChange={(e) => setView(e.target.value)} size="large">
								<Row>
									<Col>
										<Radio.Button value={ASSETS_VIEW} className="dd-stat">
											<ItemDisplay
												label="You Own"
												result={totalAssets}
												currency={selectedCurrency}
												info="This is the total valuation of the assets you own."
											/>
										</Radio.Button>
									</Col>
									<Col>
										<Radio.Button value={LIABILITIES_VIEW} className="dd-stat">
											<ItemDisplay
												label="You Owe"
												result={-totalLiabilities}
												currency={selectedCurrency}
												info="This is the total valuation of all the money you owe."
												pl
											/>
										</Radio.Button>
									</Col>
								</Row>
							</Radio.Group>
						</Row>
						<HoldingTabView liabilities={view !== ASSETS_VIEW} />
					</Fragment>
				) : (
					<Skeleton active />
				)}
			</div>
		</Fragment>
	);
}
