import React, { Fragment, useContext, useState } from 'react';
import { Col, Empty, Row, Skeleton, Tabs, Avatar, Tooltip } from 'antd';
import { NWContext } from './NWContext';
import AddHoldings from './addHoldings/AddHoldings';
import UploadHoldings from './UploadHoldings';
import { toHumanFriendlyCurrency } from '../utils';
import ListHoldings from './ListHoldings';
import { COLORS } from '../../CONSTANTS';
import { ALL_FAMILY } from './FamilyInput';
import { UserOutlined } from '@ant-design/icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function HoldingTabView() {
	const {
		tabs,
		activeTab,
		setActiveTab,
		allFamily,
		selectedMembers,
		loadingHoldings,
		selectedCurrency
	}: any = useContext(NWContext);
	const [ childTab, setChildTab ] = useState<string>('');
	const { TabPane } = Tabs;

	function renderTabs(tabsData: any, defaultActiveKey: string, isRoot?: boolean) {
		return (
			<Tabs
				defaultActiveKey={defaultActiveKey}
				activeKey={isRoot ? activeTab : childTab ? childTab : defaultActiveKey}
				type={isRoot ? 'card' : 'line'}
				onChange={(activeKey) => {
					if (isRoot) {
						setActiveTab(activeKey);
						setChildTab('');
					} else setChildTab(activeKey);
				}}
			>
				{Object.keys(tabsData).map((tabName) => {
					const { label, hasUploader, children } = tabsData[tabName];
					return (
						<TabPane key={label} tab={label}>
							{children ? (
								renderTabs(children, Object.keys(children)[0])
							) : (
								<Fragment>
									<Row justify="space-between">
										<Col>
											<Row>
												{selectedMembers.length && (
													<Col>
														{selectedMembers.indexOf(ALL_FAMILY) > -1 ? (
															<Tooltip title="Family">
																<Avatar
																	icon={<FontAwesomeIcon icon={faUserFriends} />}
																/>
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
													<h2 style={{ color: COLORS.GREEN }}>
														&nbsp;&nbsp;
														{toHumanFriendlyCurrency(
															tabsData[tabName].total,
															selectedCurrency
														)}
													</h2>
												</Col>
											</Row>
										</Col>
										<Col>
											{hasUploader && <UploadHoldings />}
											<AddHoldings
												isPrimary={!hasUploader}
												data={tabsData[tabName].data}
												changeData={tabsData[tabName].setData}
												input={tabsData[tabName].input}
												title={`${tabsData[tabName].label} - Add Record`}
											/>
										</Col>
									</Row>
									{!loadingHoldings ? tabsData[tabName].data.length ? tabsData[tabName]
										.contentComp ? (
										tabsData[tabName].contentComp
									) : (
										<ListHoldings
											data={tabsData[tabName].data}
											changeData={tabsData[tabName].setData}
											viewComp={tabsData[tabName].viewComp}
											typeOptions={tabsData[tabName].typeOptions}
											subtypeOptions={tabsData[tabName].subtypeOptions}
										/>
									) : (
										<Empty description="No data found." />
									) : (
										<Skeleton loading />
									)}
								</Fragment>
							)}
						</TabPane>
					);
				})}
			</Tabs>
		);
	}

	return renderTabs(tabs, activeTab, true);
}
