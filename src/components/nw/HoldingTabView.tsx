import React, { Fragment, useContext, useState } from 'react';
import { Col, Empty, Row, Tabs } from 'antd';
import { NWContext } from './NWContext';
import AddHoldings from './addHoldings/AddHoldings';
import UploadHoldings from './UploadHoldings';
import { getFamilyNames } from './nwutils';

export default function HoldingTabView() {
	const { tabs, activeTab, setActiveTab, allFamily, selectedMembers, loadingHoldings }: any = useContext(NWContext);
	const [childTab, setChildTab] = useState<string>('');
	const { TabPane } = Tabs;

	function renderTabs(tabsData: any, defaultActiveKey: string, isRoot?: boolean) {
		return (
			<Tabs
				defaultActiveKey={defaultActiveKey}
				activeKey={isRoot ? activeTab : childTab ? childTab : defaultActiveKey}
				type={isRoot ? 'card' : 'line'}
				onChange={(activeKey) => {
					if(isRoot) {
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
										<Col>{`${getFamilyNames(selectedMembers, allFamily)} Portfolio`}</Col>
										<Col>
											{hasUploader && <UploadHoldings />}
											<AddHoldings
												isPrimary={!hasUploader}
												data={tabsData[tabName].data}
												changeData={tabsData[tabName].setData}
											>
												Dummy
											</AddHoldings>
										</Col>
									</Row>
									{!loadingHoldings ? (
										tabsData[tabName].content
									) : (
										<Empty description={<p>No data found.</p>} />
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
