import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Col, Empty, Row, Skeleton, Tabs } from 'antd';
import { NPS_TAB, NWContext } from './NWContext';
import AddHoldings from './addHoldings/AddHoldings';
import UploadHoldings from './UploadHoldings';
import { toHumanFriendlyCurrency } from '../utils';
import ListHoldings from './ListHoldings';
import { COLORS } from '../../CONSTANTS';

export default function HoldingTabView() {
	const {
		tabs,
		activeTab,
		setActiveTab,
		loadingHoldings,
		selectedCurrency,
		childTab,
		setChildTab,
		npsData,
		loadNPSSubCategories
	}: any = useContext(NWContext);
	const [ npsSubCat, setNPSSubCat ] = useState<any>({});
	const { TabPane } = Tabs;

	useEffect(() => {
		if(childTab === NPS_TAB) {
		if(npsData.length===0) {
			(async() => setNPSSubCat(await loadNPSSubCategories()))();
		}
	}
	}, [childTab])

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
													<h2 style={{ color: COLORS.GREEN }}>
														&nbsp;&nbsp;
														{toHumanFriendlyCurrency(
															tabsData[tabName].total,
															selectedCurrency
														)}
													</h2>
										</Col>
										<Col>
											{hasUploader && <UploadHoldings />}
											<AddHoldings
												isPrimary={!hasUploader}
												data={tabsData[tabName].data}
												changeData={tabsData[tabName].setData}
												title={`${tabsData[tabName].label} - Add Record`}
												categoryOptions={tabsData[tabName].categoryOptions}
												subCategoryOptions={childTab===NPS_TAB ? npsSubCat : tabsData[tabName].subCategoryOptions}
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
											categoryOptions={tabsData[tabName].categoryOptions}
											subCategoryOptions={childTab===NPS_TAB ? npsSubCat : tabsData[tabName].subCategoryOptions}
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
