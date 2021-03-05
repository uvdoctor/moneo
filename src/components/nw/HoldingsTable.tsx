import React from "react";
import { Empty } from "antd";
import { toReadableNumber } from "../utils";
import Holding from "./Holding";
import HoldingsFilter from "./HoldingsFilter";

import "./HoldingsTable.less";

interface HoldingsTableProp {
	data?: any;
	insNames?: any;
}

export default function HoldingsTable({ data, insNames }: HoldingsTableProp) {
	return Object.keys(data)?.length ? (
		<>
			<HoldingsFilter />
			{Object.keys(data)?.map((key: string, i: number) => {
				const qty = toReadableNumber(
					data[key],
					("" + data[key]).includes(".") ? 3 : 0
				);

				return (
					<Holding key={i} assetName={insNames[key]} qty={qty} isin={key} />
				);
			})}
		</>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
