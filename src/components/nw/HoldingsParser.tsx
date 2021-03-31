import React from "react";
import { Statistic, Select } from "antd";
import HoldingTabs from "./HoldingTabs";
import HoldingsChart from "./HoldingsChart";
import SearchFilter from "./SearchFilter";
import DataSwitcher from "../DataSwitcher";

import "./nw.less";

export default function HoldingsParser() {
	const { Option } = Select;
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	return (
		<div className="nw-container">
			<div className="dd-stat">
				<Statistic
					title={
						<Select
							defaultValue="total"
							style={{ width: 200 }}
							bordered={false}
						>
							<Option value="total">Total Portfolio Value</Option>
							<Option value="ANZOIRU4526">ANZOIRU4526</Option>
							<Option value="BMKJFI2578D">BMKJFI2578D</Option>
						</Select>
					}
					value={213454654}
					prefix={
						<Select className="currency-selector" defaultValue="₹">
							<Option value="₹">₹</Option>
							<Option value="$">$</Option>
							<Option value="€">€</Option>
						</Select>
					}
				/>
			</div>
			<DataSwitcher title={<h3>Holdings details</h3>}>
				<Chart>
					<HoldingsChart />
				</Chart>
				<DataSwitcherList>
					<SearchFilter />
					<HoldingTabs />
				</DataSwitcherList>
			</DataSwitcher>
		</div>
	);
}
