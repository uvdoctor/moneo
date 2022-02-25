import React, { useState, useEffect } from "react";
import { Input, Dropdown, Radio, List, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ROUTES } from "../CONSTANTS";

interface SearchProps {
	inline?: boolean;
}

export default function Search({ inline }: SearchProps) {
	const [searchText, setSearchText] = useState("");
	const [searchType, setSearchType] = useState("stock");
	const [searchResults, setSearchResults] = useState([
		{
			Code: "SBIN",
			Exchange: "NSE",
			Name: "State Bank of India",
			Type: "Common Stock",
			Country: "India",
			Currency: "INR",
			ISIN: "INE062A01020",
			previousClose: 529.6,
			previousCloseDate: "2022-02-11",
		},
	]);
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
	let searchTimeout: any;
	const onSearch = ({ target: { value } }: any) => {
		setSearchText(value);
	};
	const getSearchData = async () => {
		try {
			const response = await fetch(
				`/api/search?text=${searchText}&type=${searchType}`
			);
			const data = await response.json();

			setSearchResults(data);
		} catch (err) {
			console.log(err);
		}
	};
	const onSearchTypeChange = ({ target: { value } }: any) => {
		setSearchType(value);
	};

	useEffect(() => {
		if (searchText.length < 3) return;
		if (searchTimeout) clearTimeout(searchTimeout);

		searchTimeout = setTimeout(() => {
			getSearchData();
		}, 200);
	}, [searchText]);

	useEffect(() => {
		if (searchText.length < 3) return;
		getSearchData();
	}, [searchType]);

	return (
		<Comp
			style={{ width: "600px" }}
			overlay={
				<>
					<List
						size="small"
						header={
							<Radio.Group value={searchType} onChange={onSearchTypeChange}>
								<Radio.Button value="stock">Stocks</Radio.Button>
								<Radio.Button value="etf">ETFs</Radio.Button>
								<Radio.Button value="bond">Bonds</Radio.Button>
								<Radio.Button value="fund">Mutual Funds</Radio.Button>
							</Radio.Group>
						}
						bordered
						dataSource={searchResults}
						renderItem={({ Code, Name, Exchange, Type }) => (
							<List.Item>
								<Link href={`${ROUTES.LOOKUP}/${Code}.${Exchange}`}>
									<a>
										{Name} <Tag color="green">{Type}</Tag>
									</a>
								</Link>
							</List.Item>
						)}
					/>
				</>
			}
			arrow
		>
			<Input
				value={searchText}
				size="large"
				placeholder="Search stocks, bonds and MF's"
				prefix={<SearchOutlined />}
				onChange={onSearch}
			/>
		</Comp>
	);
}
