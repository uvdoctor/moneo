import React, { Fragment, useContext, useEffect } from 'react';
import HoldingTabView from './HoldingTabView';
import DataSwitcher from '../DataSwitcher';
import { NWContext } from './NWContext';
import { Avatar, Button, Col, PageHeader, Row, Skeleton, Tooltip } from 'antd';
import SelectInput from '../form/selectinput';
import { SaveOutlined, UserOutlined } from '@ant-design/icons';

import './nw.less';
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
		saveHoldings,
		selectedMembers,
		allFamily
	}: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(
		() => {
			if (!loadingHoldings) setResults([ ...[ <TotalNetWorth />, <TotalAssets />, <TotalLiabilities /> ] ]);
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
									onClick={() => saveHoldings()}
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
