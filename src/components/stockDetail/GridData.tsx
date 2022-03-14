import { Row, Col, Typography } from "antd";

export default function GridData({ data }: any) {
	const { Text } = Typography;

	return (
		<Row gutter={[10, 10]}>
			{Object.keys(data).map((key) =>
				typeof data[key] !== "object" ? (
					<Col key={key} xs={24} sm={12} md={8} lg={6}>
						<Text>{key.split(/(?=[A-Z])/).join(" ")}</Text>
						<div>
							<Text strong>{data[key]}</Text>
						</div>
					</Col>
				) : null
			)}
		</Row>
	);
}
