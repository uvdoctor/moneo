import { Col, Row } from 'antd';
import React from 'react';

interface KeyFeaturesProps {
	features: Array<any>;
}

export default function KeyFeatures({ features }: KeyFeaturesProps) {
	return (
		<Row className="key-features">
			{features.map((result: any, i: number) => (
				<Col key={'feature' + i} xs={24} sm={12} md={8} lg={6} xl={4}>
					<h4>{result.title}</h4>
					<p>{result.content}</p>
				</Col>
			))}
		</Row>
	);
}
