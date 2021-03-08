import React from "react";
import { Tabs } from "antd";
import HoldingsTable from "./HoldingsTable";
import AddHoldings from "./AddHoldings";
import UploadHoldings from "./UploadHoldings";

export default function HoldingTabs({
	insNames,
	equities,
	bonds,
	mutualFunds,
	etfs,
}: any) {
	const { TabPane } = Tabs;

	return (
		<Tabs defaultActiveKey="I" type="card" tabBarExtraContent={<AddHoldings />}>
			<TabPane key="I" tab="Investements">
				<UploadHoldings />
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
					<TabPane key="ETF" tab="ETFs">
						<HoldingsTable data={etfs} insNames={insNames} />
					</TabPane>
				</Tabs>
			</TabPane>
			<TabPane key="L" tab="Loans">
				Loans goes here...
			</TabPane>
			<TabPane key="N" tab="NPS">
				NPS goes here...
			</TabPane>
			<TabPane key="D" tab="Deposites">
				Deposits goes here...
			</TabPane>
		</Tabs>
	);
}
