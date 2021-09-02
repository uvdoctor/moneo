import React, { Fragment, useContext, useState } from 'react';
import { Col, Empty, Row, Skeleton, Tabs } from 'antd';
import { NWContext } from './NWContext';
import AddHoldings from './addHoldings/AddHoldings';
import UploadHoldings from './UploadHoldings';
import { getFamilyNames } from './nwutils';
import { toHumanFriendlyCurrency } from '../utils';
import ListHoldings from './ListHoldings';

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
									<Row justify="space-between" className="header">
										<Col>{`${getFamilyNames(
											selectedMembers,
											allFamily
										)} Portfolio Value is ${toHumanFriendlyCurrency(
											tabsData[tabName].total,
											selectedCurrency
										)}`}</Col>
										<Col>
											{hasUploader && <UploadHoldings />}
											<AddHoldings
												isPrimary={!hasUploader}
												data={tabsData[tabName].data}
												changeData={tabsData[tabName].setData}
												input={tabsData[tabName].input}
												inputComp={tabsData[tabName].inputComp}
											/>
										</Col>
									</Row>
									{!loadingHoldings ? (
										tabsData[tabName].data.length ?
										<ListHoldings 
											data={tabsData[tabName].data}
											changeData={tabsData[tabName].setData}
											viewComp={tabsData[tabName].viewComp}
											typeOptions={tabsData[tabName].typeOptions}
											subtypeOptions={tabsData[tabName].subtypeOptions}
										/>
										: <Empty description="No data found." />
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
