import { useContext } from "react";
import { Row, Col } from "antd";
import StockDetailContext from "./StockDetailContext";
import SymbolInfo from "./SymbolInfo";
import CompanyProfile from "./CompanyProfile";
import TechnicalAnalysis from "./TechnicalAnalysis";
import FundamentalData from "./FundamentalData";

require("./StockDetail.less");

export default function StockDetail() {
	/* @ts-ignore */
	const { stock } = useContext(StockDetailContext);

	return (
		<div className="stock-detail">
			<Row gutter={[15, 15]}>
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
			</Row>
		</div>
	);
}
