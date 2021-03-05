import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function AddHoldings() {
	return (
		<div className="text-right">
			<Button type="primary" icon={<PlusOutlined />}>
				Add
			</Button>
		</div>
	);
}
