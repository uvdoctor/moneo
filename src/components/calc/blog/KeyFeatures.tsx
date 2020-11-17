import { Col, Row } from 'antd';
import React from 'react';
import { BlogInputProps } from '../Layout';

export default function KeyFeatures({ elements }: BlogInputProps) {
	return (
		<Row className="key-features">
			{elements.map((result: any, i: number) => (
				result ? <Col key={'feature' + i} xs={24} sm={12} md={8} lg={6} xl={4}>
					<h4>{result.title}</h4>
					<p>{result.content}</p>
				</Col> : null
			))}
		</Row>
	);
}
