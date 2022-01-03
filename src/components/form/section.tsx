import React, { ReactNode } from 'react';
import { Row, Col } from 'antd';
interface SectionProps {
	title?: any;
	footer?: any;
	toggle?: any;
	manualInput?: any;
	manualMode?: number;
	videoSrc?: string;
	children?: ReactNode;
}

export default function Section(props: SectionProps) {
	return (
		<Row>
			{props.title && <Col span={24}>
				<h3 className="steps-heading">
					{(typeof props.title === 'string') ? 
						
						`${props.title} ` : props.title}
				</h3> 
			</Col>}
			{props.toggle && (
				<Col span={24} style={{ marginBottom: '0.5rem' }}>
					{props.toggle}
				</Col>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				<Col span={24}>{props.manualInput}</Col>
			) : (
				React.Children.map(
					props.children,
					(child: any, i: number) =>
						child ? (
							<Col span={24} key={'section' + i}>
								<Col span={24}>{child}</Col>
								{(!child.type.name || !child.type.name.endsWith('Options')) && (
									<Col className="fields-divider" span={24} />
								)}
							</Col>
						) : (
							<div />
						)
				)
			)}
			{props.footer && (
				<Col span={24}>{props.footer}</Col>
			)}
		</Row>
	);
}
