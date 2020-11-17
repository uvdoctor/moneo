import { Col, Collapse, Row } from 'antd';
import React, { Fragment } from 'react';
import Image from 'next/image';
import { BlogInputProps } from '../Layout';

export default function ExpectedResults({ elements }: BlogInputProps) {
	const { Panel } = Collapse;

	return (
		<Fragment>
			{elements.map((result: any, i: number) => (
				result ? <Collapse defaultActiveKey={[ '0' ]}>
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
				</Collapse> : null
			))}
		</Fragment>
	);
}
