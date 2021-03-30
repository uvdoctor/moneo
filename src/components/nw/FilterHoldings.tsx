import React, { useState } from "react";
import { Drawer, Button, Tooltip, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";

export default function FilterHoldings() {
	const { Option } = Select;
	const [showDrawer, setDrawerVisibility] = useState(false);

	return (
		<Tooltip title="Filter">
			<Button
				type="primary"
				shape="circle"
				icon={<FilterOutlined />}
				onClick={() => setDrawerVisibility(true)}
			/>
			<Drawer
				width={320}
				title="Filter Holdings"
				placement="right"
				closable={true}
				onClose={() => setDrawerVisibility(false)}
				visible={showDrawer}
				footer={
					<Button type="primary" onClick={() => setDrawerVisibility(false)}>
						Filter
					</Button>
				}
			>
				<p>Holdings name</p>
				<Select defaultValue="my" style={{ width: 120 }}>
					<Option value="my">My Holdings</Option>
					<Option value="wife">Wife Holdings</Option>
					<Option value="kids">Kids Holdings</Option>
				</Select>
				<p>Currency</p>
				<Select defaultValue="$" style={{ width: 120 }}>
					<Option value="$">$</Option>
					<Option value="£">£</Option>
					<Option value="₹">₹</Option>
				</Select>
			</Drawer>
		</Tooltip>
	);
}
