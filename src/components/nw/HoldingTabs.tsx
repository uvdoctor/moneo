import React, { useContext } from "react";
import { Tabs } from "antd";
import { NWContext } from "./NWContext";
import HoldingsTable from "./HoldingsTable";
import AddHoldings from "./AddHoldings";
import UploadHoldings from "./UploadHoldings";

export default function HoldingTabs() {
	const { tabs, insNames }: any = useContext(NWContext);
	const { TabPane } = Tabs;

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
							{childrens ? (
								renderTabs(childrens)
							) : (
								<HoldingsTable data={data} insNames={insNames} />
							)}
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
