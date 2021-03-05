import React from "react";
import { Input } from "antd";

import "./HoldingsFilter.less";

export default function HoldingsFilter() {
	return (
		<div className="holdings-filter">
			<Input placeholder="Filter holdings..." />
		</div>
	);
}
