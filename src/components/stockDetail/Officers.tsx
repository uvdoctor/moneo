import { useContext } from "react";
import { Row, Col, Typography } from "antd";
import StockDetailContext from "./StockDetailContext";

export default function Officers() {
	const {
		/* @ts-ignore */
		state: {
			data: {
				General: { Officers },
			},
		},
	} = useContext(StockDetailContext);
	const { Title, Text } = Typography;

	return Officers ? (
		<div style={{ paddingTop: "35px" }}>
			<Title level={5}>Officers</Title>
			<Row gutter={[10, 10]}>
				{Object.keys(Officers).map((key) => (
					<Col key={key} xs={24} sm={12} md={8} lg={6}>
						<Text strong>{Officers[key].Name}</Text>
						<div>
							<Text>{Officers[key].Title}</Text>
						</div>
						<div>Year Born: {Officers[key].YearBorn}</div>
					</Col>
				))}
			</Row>
		</div>
	) : null;
}
