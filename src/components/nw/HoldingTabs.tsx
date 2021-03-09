import React, { useContext } from "react";
import { Tabs } from "antd";
import { NWContext } from "./NWContext";
import HoldingsTable from "./HoldingsTable";
import AddHoldings from "./AddHoldings";
import UploadHoldings from "./UploadHoldings";
import DataSwitcher from "../DataSwitcher";

export default function HoldingTabs() {
	const { tabs, insNames }: any = useContext(NWContext);
	const { TabPane } = Tabs;
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	function renderTabs(tabsData: any) {
		return (
			<Tabs
				defaultActiveKey="I"
				type="card"
				tabBarExtraContent={<AddHoldings />}
			>
				{tabsData.map(({ label, data, childrens }: any) => {
					return (
						<TabPane key={label} tab={label}>
							<DataSwitcher title={<h3>Holdings details</h3>}>
								<Chart>Chart goes here...</Chart>
								<DataSwitcherList>
									{childrens ? (
										renderTabs(childrens)
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

	return (
		<>
			<UploadHoldings />
			{renderTabs(tabs)}
		</>
	);
}
