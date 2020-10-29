import React, { Fragment, ReactNode } from 'react';
import DDVideoPlayer from '../DDVideoPlayer';
import { Row, Col } from 'antd';
interface SectionProps {
	title: any;
	footer?: any;
	toggle?: any;
	manualInput?: any;
	manualMode?: number;
	videoSrc?: string;
	children?: ReactNode;
}

export default function Section(props: SectionProps) {

	return (
		<Row justify="center" align="middle" style={{ maxWidth: '500px', maxHeight: '500px' }}>
			<Row justify="center" align="middle">
				<h3>
					{`${props.title} `}
					{props.videoSrc && <DDVideoPlayer title={props.title} url={props.videoSrc} />}
				</h3>
			</Row>
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
							<Fragment key={'section' + i}>
								<Col span={24}>{child}</Col>
								<Col className="fields-divider" span={24} />
							</Fragment>
						) : null
				)
			)}
			{props.footer && (
				<Col span={24} style={{ textAlign: 'center' }}>
					{props.footer}
				</Col>
			)}
		</Row>
	);
}
