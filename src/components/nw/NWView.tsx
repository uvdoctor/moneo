import React, { Fragment, useContext, useEffect } from 'react';
import HoldingTabView from './HoldingTabView';
import DataSwitcher from '../DataSwitcher';
import { NWContext } from './NWContext';
import { Avatar, Col, PageHeader, Row, Skeleton, Tooltip } from 'antd';
import SelectInput from '../form/selectinput';
import { UserOutlined } from '@ant-design/icons';

require('./nw.less');
import FamilyInput, { ALL_FAMILY } from './FamilyInput';
import ResultCarousel from '../ResultCarousel';
import TotalAssets from './TotalAssets';
import TotalNetWorth from './TotalNetWorth';
import TotalLiabilities from './TotalLiabilities';
import CurrentAA from './CurrentAA';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

export default function NWView() {
	const {
		results,
		setResults,
		selectedCurrency,
		setSelectedCurrency,
		loadingHoldings,
		loadingFamily,
		currencyList,
		selectedMembers,
		allFamily
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(
		() => {
			if (!loadingHoldings) setResults([ ...[ <TotalNetWorth key="tnw" />, <TotalAssets key="ta" />, <TotalLiabilities key="tl" /> ] ]);
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
								<SelectInput
									key='currency'
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
				<ResultCarousel results={results} />
				{!loadingHoldings && !loadingFamily ? (
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
									<h2>&nbsp;Holdings</h2>
								</Col>
							</Row>
						}
					>
						<Chart>
							<CurrentAA />
						</Chart>
						<DataSwitcherList>
							<HoldingTabView />
						</DataSwitcherList>
					</DataSwitcher>
				) : (
					<Skeleton active />
				)}
			</div>
		</Fragment>
	);
}
