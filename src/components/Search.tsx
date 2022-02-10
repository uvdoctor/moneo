import React from "react";
import { Input, Dropdown, Radio, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";

interface SearchProps {
	inline?: boolean;
}

export default function Search({ inline }: SearchProps) {
	const data = [
		{ name: "Bharti Airtel", symbol: "BHARTIARTL" },
		{ name: "State bank of India", symbol: "SBIN" },
		{ name: "Reliance", symbol: "RELIANCE" },
		{ name: "HDFC Bank", symbol: "HDFCBANK" },
		{ name: "Tata motors", symbol: "TATAMOTORS" },
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
						renderItem={({ name, symbol }) => (
							<List.Item>
								<Link href={`/stockDetail/${symbol}`}>
									<a>{name}</a>
								</Link>
							</List.Item>
						)}
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
