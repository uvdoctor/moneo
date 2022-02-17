import { useContext, useEffect, useState } from "react";
import { Row, Col, PageHeader } from "antd";
import StockDetailContext from "./StockDetailContext";
import SymbolInfo from "./SymbolInfo";
import CompanyProfile from "./CompanyProfile";
import TechnicalAnalysis from "./TechnicalAnalysis";
import FundamentalData from "./FundamentalData";

require("./StockDetail.less");

export default function StockDetail() {
	/* @ts-ignore */
	const { name } = useContext(StockDetailContext);
	const [details, setDetails] = useState({});

	const getDetails = async (text: string) => {
		try {
			const response = await fetch(`/api/details?name=${name}`);
			const data = await response.json();

			setDetails(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (!name) return;
		getDetails();
	}, [name]);

	return (
		<div className="stock-detail">
			<PageHeader
				title={details.General?.Code}
				subTitle={details.General?.Name}
			>
				{details.General?.Description}
			</PageHeader>
			{/*<Row gutter={[15, 15]}>
				<Col xs={24}>
					<SymbolInfo />
				</Col>
				<Col xs={18}>
					<CompanyProfile />
				</Col>
				<Col xs={6}>
					<TechnicalAnalysis />
				</Col>
				<Col flex="auto">{stock}</Col>
				<Col xs={4} flex="none">
					<FundamentalData />
				</Col>
			</Row>*/}
		</div>
	);
}
