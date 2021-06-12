import React, { useContext } from "react";
import { Tabs } from "antd";
import { NWContext } from "./NWContext";
import HoldingsTable from "./HoldingsTable";
import AddHoldings from "./addHoldings/AddHoldings";
import UploadHoldings from "./UploadHoldings";
import DataSwitcher from "../DataSwitcher";

export default function HoldingTabs() {
	const { tabs, insNames, activeTab, setActiveTab, allFamily, selectedMember }: any = useContext(
		NWContext
	);
	const { TabPane } = Tabs;
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	function renderTabs(
		tabsData: any,
		defaultActiveKey: string,
		isRoot?: boolean,
	) {
		return (
			<Tabs
				defaultActiveKey={defaultActiveKey}
				activeKey={defaultActiveKey}
				type={isRoot ? "card" : "line"}
				tabBarExtraContent={isRoot ? <AddHoldings /> : null}
				onChange={(activeKey) => setActiveTab(activeKey)}
			>
				{tabsData.map(({ label, hasUploader, data, childrens }: any) => {
					return (
						<TabPane key={label} tab={label}>
							<DataSwitcher
								icons={
									hasUploader ? (
										<>
											<UploadHoldings />
										</>
									) : null
								}
								title={<strong>{`Portfolio for ${allFamily[selectedMember]}`}</strong>}>
								<Chart>Chart goes here...</Chart>
								<DataSwitcherList>
									{childrens ? (
										renderTabs(childrens, activeTab)
									) : (
										<HoldingsTable data={data} insNames={insNames} />
									)}
								</DataSwitcherList>
							</DataSwitcher>
						</TabPane>
					);
				})}
			</Tabs>
		);
	}

	return renderTabs(tabs, activeTab, true);
}

