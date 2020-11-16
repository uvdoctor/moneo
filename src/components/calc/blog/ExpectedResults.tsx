import { Col, Collapse, Row } from 'antd';
import React, { Fragment } from 'react';
import Image from 'next/image';

interface ExpectedResultsProps {
	results: Array<any>;
}

export default function ExpectedResults({ results }: ExpectedResultsProps) {
	const { Panel } = Collapse;

	return (
		<Fragment>
			{results.map((result: any, i: number) => (
				<Collapse defaultActiveKey={[ '' + i ]}>
					<Panel header={result.title} key={'' + i}>
						<Row gutter={[ 20, 20 ]}>
							<Col md={4}>
								<Image src={result.imgSrc} width={result.imgWidth} height={result.imgHeight} alt={result.imgAlt} />
							</Col>
							<Col md={20}>
								<p>
									{result.content}
								</p>
							</Col>
						</Row>
					</Panel>
				</Collapse>
			))}
		</Fragment>
	);
}
