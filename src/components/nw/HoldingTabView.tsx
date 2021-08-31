import React, { useContext } from 'react';
import { Col, Empty, Row, Tabs } from 'antd';
import { NWContext } from './NWContext';
import AddHoldings from './addHoldings/AddHoldings';
import UploadHoldings from './UploadHoldings';
import { getFamilyNames } from './nwutils';

export default function HoldingTabView() {
	const { tabs, activeTab, setActiveTab, allFamily, selectedMembers, loadingHoldings }: any = useContext(NWContext);
	const { TabPane } = Tabs;

	function renderTabs(tabsData: any, defaultActiveKey: string, isRoot?: boolean) {
		return (
			<Tabs
				defaultActiveKey={defaultActiveKey}
				activeKey={defaultActiveKey}
				type={isRoot ? 'card' : 'line'}
				onChange={(activeKey) => setActiveTab(activeKey)}
			>
				{Object.keys(tabsData).map((tabName) => {
					const { label, hasUploader, childrens } = tabsData[tabName];

					return (
						<TabPane key={label} tab={label}>
							<Row justify="space-between" className="header">
								<Col>{`${getFamilyNames(selectedMembers, allFamily)} Portfolio`}</Col>
								<Col>
									{hasUploader && <UploadHoldings />}
									<AddHoldings isPrimary={!hasUploader}>Dummy</AddHoldings>
								</Col>
							</Row>
							{childrens ? (
								renderTabs(childrens, activeTab)
							) : !loadingHoldings ? tabs[tabName].data.length ? (
								tabs[tabName].content
							) : (
								<Empty description={<p>No data found.</p>} />
							) : null}
						</TabPane>
					);
				})}
			</Tabs>
		);
	}

	return renderTabs(tabs, activeTab, true);
}
