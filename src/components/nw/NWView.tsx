import React, { Fragment, useContext, useState } from 'react';
import HoldingTabView from './HoldingTabView';
import DataSwitcher from '../DataSwitcher';
import { NWContext } from './NWContext';
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
		totalLiabilities
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;
	const ASSETS_VIEW = 'assets';
	const LIABILITIES_VIEW = 'liabilities';
	const [
		view,
		setView
	] = useState<string>(ASSETS_VIEW);

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
				<TotalNetWorth />
				{!loadingHoldings && !loadingFamily ? (
					<Fragment>
						<Row justify="center">
							<Radio.Group value={view} onChange={(e) => setView(e.target.value)} size="large">
								<Radio.Button value={ASSETS_VIEW} style={{paddingTop: 2}}>
									<ItemDisplay
										label="You Own"
										result={totalAssets}
										currency={selectedCurrency}
										info="ABC"
										pl
									/>
								</Radio.Button>
								<Radio.Button value={LIABILITIES_VIEW} style={{paddingTop: 2}}>
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
