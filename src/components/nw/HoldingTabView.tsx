import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Col, Empty, Row, Skeleton, Tabs, Tooltip } from 'antd';
import { TAB, NWContext } from './NWContext';
import AddHoldings from './addHoldings/AddHoldings';
import UploadHoldings from './UploadHoldings';
import { toHumanFriendlyCurrency } from '../utils';
import ListHoldings from './ListHoldings';
import { COLORS } from '../../CONSTANTS';
import ListProperties from './ListProperties';
import InfoCircleOutlined from '@ant-design/icons/lib/icons/InfoCircleOutlined';

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
		loadNPSSubCategories,
		setIsDirty
	}: any = useContext(NWContext);
	const [ npsSubCat, setNPSSubCat ] = useState<any>({});
	const { TabPane } = Tabs;

	useEffect(
		() => {
			if (childTab === TAB.NPS) {
				if (npsData.length === 0) {
					(async () => setNPSSubCat(await loadNPSSubCategories()))();
				}
			}
		},
		[ childTab ]
	);

	useEffect(
		() => {
			const children = tabs[activeTab].children ? tabs[activeTab].children : '';
			children ? setChildTab(Object.keys(children)[0]) : setChildTab('');
		},
		[ activeTab ]
	);

	useEffect(() => {
		setIsDirty(false);
	}, []);

	function renderTabs(tabsData: any, defaultActiveKey: string, isRoot?: boolean) {
		return (
			<Tabs
				defaultActiveKey={defaultActiveKey}
				activeKey={isRoot ? activeTab : childTab ? childTab : defaultActiveKey}
				type={isRoot ? 'card' : 'line'}
				onChange={(activeKey) => {
					if (isRoot) {
						setActiveTab(activeKey);
					} else setChildTab(activeKey);
				}}
				tabBarExtraContent={!isRoot && activeTab === 'Financial' ? <UploadHoldings /> : null}
			>
				{Object.keys(tabsData).map((tabName) => {
					const { label, children, hasUploader, info } = tabsData[tabName];
					return (
						<TabPane
							key={label}
							tab={
								<Fragment>
									{label}
									<Tooltip title={info} color={COLORS.DEFAULT}>
										{children ? '' : <InfoCircleOutlined />}
									</Tooltip>
								</Fragment>
							}
						>
							{children ? (
								renderTabs(children, Object.keys(children)[0])
							) : (
								<Fragment>
									<Row justify="space-between">
										<Col>
											<h2 style={{ color: COLORS.GREEN }}>
												&nbsp;&nbsp;
												{toHumanFriendlyCurrency(tabsData[tabName].total, selectedCurrency)}
											</h2>
										</Col>
										<Col>
											<AddHoldings
												isPrimary={!hasUploader}
												data={tabsData[tabName].data}
												changeData={tabsData[tabName].setData}
												title={`${tabsData[tabName].label} - Add Record`}
												categoryOptions={tabsData[tabName].categoryOptions}
												subCategoryOptions={
													childTab === TAB.NPS ? (
														npsSubCat
													) : (
														tabsData[tabName].subCategoryOptions
													)
												}
											/>
										</Col>
									</Row>
									{!loadingHoldings ? tabsData[tabName].data.length ? tabsData[tabName]
										.contentComp ? (
										tabsData[tabName].contentComp
									) : tabsData[tabName].label === TAB.PROP ? (
										<ListProperties
											data={tabsData[tabName].data}
											changeData={tabsData[tabName].setData}
											categoryOptions={tabsData[tabName].categoryOptions}
										/>
									) : (
										<ListHoldings
											data={tabsData[tabName].data}
											changeData={tabsData[tabName].setData}
											viewComp={tabsData[tabName].viewComp}
											categoryOptions={tabsData[tabName].categoryOptions}
											subCategoryOptions={
												childTab === TAB.NPS ? npsSubCat : tabsData[tabName].subCategoryOptions
											}
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
