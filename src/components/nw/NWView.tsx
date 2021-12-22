import React, { Fragment, useContext } from 'react';
import HoldingTabView from './HoldingTabView';
import DataSwitcher from '../DataSwitcher';
import { ASSETS_VIEW, LIABILITIES_VIEW, NWContext } from './NWContext';
import { Avatar, Col, PageHeader, Radio, Row, Skeleton, Tooltip } from 'antd';
import SelectInput from '../form/selectinput';
import { UserOutlined } from '@ant-design/icons';

require('./nw.less');
import FamilyInput, { ALL_FAMILY } from './FamilyInput';
import TotalNetWorth from './TotalNetWorth';
import CurrentAA from './CurrentAA';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import ItemDisplay from '../calc/ItemDisplay';

export default function NWView() {
	const {
		selectedCurrency,
		setSelectedCurrency,
		loadingHoldings,
		loadingFamily,
		currencyList,
		selectedMembers,
		allFamily,
		totalAssets,
		totalLiabilities,
		view,
		setView
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

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
								<Radio.Button value={ASSETS_VIEW} style={{paddingTop: 8}}>
									<ItemDisplay
										label="You Own"
										result={totalAssets}
										currency={selectedCurrency}
										info="ABC"
										pl
									/>
								</Radio.Button>
								<Radio.Button value={LIABILITIES_VIEW} style={{paddingTop: 8}}>
									<ItemDisplay
										label="You Owe"
										result={totalLiabilities}
										currency={selectedCurrency}
										info="ABC"
										pl
									/>
								</Radio.Button>
							</Radio.Group>
						</Row>
						<DataSwitcher
							title={
								<Row>
									{selectedMembers.length && (
										<Col>
											{selectedMembers.indexOf(ALL_FAMILY) > -1 ? (
												<Tooltip title="Family">
													<Avatar icon={<FontAwesomeIcon icon={faUserFriends} />} />
												</Tooltip>
											) : (
												<Avatar.Group maxCount={2}>
													{selectedMembers.forEach(
														(key: string) =>
															allFamily[key] && (
																<Tooltip title={allFamily[key]}>
																	<Avatar icon={<UserOutlined />} />
																</Tooltip>
															)
													)}
												</Avatar.Group>
											)}
										</Col>
									)}
									<Col>
										<h2>&nbsp;{view === ASSETS_VIEW ? 'You Own' : 'You Owe'}</h2>
									</Col>
								</Row>
							}>
							<Chart>
								<CurrentAA />
							</Chart>
							<DataSwitcherList>
								<HoldingTabView liabilities={view !== ASSETS_VIEW} />
							</DataSwitcherList>
						</DataSwitcher>
					</Fragment>
				) : (
					<Skeleton active />
				)}
			</div>
		</Fragment>
	);
}
