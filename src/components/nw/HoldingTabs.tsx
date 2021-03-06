import React from "react";
import { Tabs } from "antd";
import HoldingsTable from "./HoldingsTable";
import AddHoldings from "./AddHoldings";

export default function HoldingTabs({
	insNames,
	equities,
	bonds,
	mutualFunds,
	etfs
}: any) {
	const { TabPane } = Tabs;

	return (
		<Tabs defaultActiveKey="E" type="card" tabBarExtraContent={<AddHoldings />}>
			<TabPane key="E" tab="Stocks">
				<HoldingsTable data={equities} insNames={insNames} />
			</TabPane>
			<TabPane key="B" tab="Bonds">
				<HoldingsTable data={bonds} insNames={insNames} />
			</TabPane>
			<TabPane key="ETF" tab="ETF">
				<HoldingsTable data={etfs} insNames={insNames} />
			</TabPane>
			<TabPane key="M" tab="Mutual Funds">
				<HoldingsTable data={mutualFunds} insNames={insNames} />
			</TabPane>
		</Tabs>
	);
}
