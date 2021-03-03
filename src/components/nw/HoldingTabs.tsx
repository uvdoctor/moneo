import React from "react";
import { Tabs, Empty } from "antd";
import { toReadableNumber } from "../utils";

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
				{!Object.keys(equities).length && (
					<Empty description={<p>No data found.</p>} />
				)}
				{Object.keys(equities)?.map((key: string, i: number) => (
					<p key={"stock" + i}>
						{key} - {insNames[key]}: {equities[key]}
					</p>
				))}
			</TabPane>
			<TabPane key="B" tab="Bonds">
				{!Object.keys(bonds).length && (
					<Empty description={<p>No data found.</p>} />
				)}
				{Object.keys(bonds)?.map((key: string, i: number) => (
					<p key={"bond" + i}>
						{key} - {insNames[key]}: {bonds[key]}
					</p>
				))}
			</TabPane>
			<TabPane key="M" tab="Mutual Funds">
				{!Object.keys(mutualFunds).length && (
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
				))}
			</TabPane>
		</Tabs>
	);
}
