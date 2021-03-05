import React from "react";
import { Tabs } from "antd";
import HoldingsTable from "./HoldingsTable";

export default function HoldingTabs({
	insNames,
	equities,
	bonds,
	mutualFunds,
}: any) {
	const { TabPane } = Tabs;

	return (
		<Tabs defaultActiveKey="E" type="card">
			<TabPane key="E" tab="Equities">
				<HoldingsTable data={equities} insNames={insNames} />
			</TabPane>
			<TabPane key="B" tab="Bonds">
				<HoldingsTable data={bonds} insNames={insNames} />
			</TabPane>
			<TabPane key="M" tab="Mutual Funds">
				<HoldingsTable data={mutualFunds} insNames={insNames} />
			</TabPane>
		</Tabs>
	);
}
