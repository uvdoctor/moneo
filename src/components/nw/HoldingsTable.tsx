import React from "react";
import { Empty } from "antd";
import Holding from "./Holding";

import "./HoldingsTable.less";

interface HoldingsTableProp {
	data: any;
	onChange: Function;
}

export default function HoldingsTable({ data, onChange }: HoldingsTableProp) {
	return Object.keys(data)?.length ? (
		<>
			{Object.keys(data)?.map((key: string, i: number) => 
					<Holding key={i} isin={key} data={data} onChange={onChange} />
			)}
		</>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
