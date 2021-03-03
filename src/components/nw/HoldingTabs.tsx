import React from "react";
import { Tabs, Empty } from "antd";
import HoldingsTable from "./HoldingsTable";

export default function HoldingTabs({
	insNames,
	equities,
	bonds,
	mutualFunds,
}) {
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
				{/*{!Object.keys(mutualFunds).length && (
					<Empty description={<p>No data found.</p>} />
				)}
				{Object.keys(mutualFunds)?.map((key: string, i: number) => (
					<p key={"mf" + i}>
						{key} - {insNames[key]}:{" "}
						{toReadableNumber(
							mutualFunds[key],
							("" + mutualFunds[key]).includes(".") ? 3 : 0
						)}
					</p>
				))}*/}
			</TabPane>
		</Tabs>
	);
}
