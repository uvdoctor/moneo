import React from "react";
import { Input, Dropdown, Radio, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchProps {
	inline?: boolean;
}

export default function Search({ inline }: SearchProps) {
	const data = [
		"Bharti Airtel",
		"State bank of India",
		"Reliance",
		"HDFC Bank",
		"Tata motors",
	];
	interface InlineListProps {
		style?: any;
		children?: any;
		overlay?: any;
	}
	const InlineList = ({ children, overlay }: InlineListProps) => (
		<div>
			{children} {overlay}
		</div>
	);
	const Comp = inline ? InlineList : Dropdown;

	return (
		<Comp
			style={{ width: "600px" }}
			overlay={
				<>
					<List
						size="small"
						header={
							<Radio.Group value="all" onChange={() => {}}>
								<Radio.Button value="all">All</Radio.Button>
								<Radio.Button value="stocks">Stocks</Radio.Button>
								<Radio.Button value="bonds">Bonds</Radio.Button>
							</Radio.Group>
						}
						bordered
						dataSource={data}
						renderItem={(item) => <List.Item>{item}</List.Item>}
					/>
				</>
			}
			arrow
		>
			<Input
				size="large"
				placeholder="Search stocks, bonds and MF's"
				prefix={<SearchOutlined />}
			/>
		</Comp>
	);
}
