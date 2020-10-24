import React, { Fragment, useState, ReactNode } from 'react';
import VideoPlayer from '../videoplayer';
import { YoutubeFilled, CloseOutlined } from '@ant-design/icons';
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
	const [ videoUrl, setVideoUrl ] = useState<string>('');

	return (
		<Row justify="center" align="middle" style={{ maxWidth: '500px', maxHeight: '500px' }}>
			<Col span={24}>
				<h3
					style={{ cursor: props.videoSrc ? 'pointer' : 'auto', marginRight: '0.5rem' }}
					onClick={() => (props.videoSrc ? setVideoUrl(!videoUrl ? props.videoSrc as string : '') : true)}
				>
					{`${props.title} `}
					{props.videoSrc && !videoUrl ? <YoutubeFilled /> : <CloseOutlined />}
				</h3>
			</Col>
			{videoUrl && (
				<Col span={24}>
					<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
				</Col>
			)}
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
							<Fragment key={"section"+i}>
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
