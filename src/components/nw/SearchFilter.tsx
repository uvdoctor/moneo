import React from "react";
import { Input } from "antd";

import "./SearchFilter.less";

export default function SearchFilter() {
	return (
		<div className="holdings-filter">
			<Input placeholder="Search holdings..." />
		</div>
	);
}
