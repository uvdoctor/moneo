import React, { Fragment, useState } from 'react';
import VideoPlayer from '../videoplayer';
import { YoutubeFilled, CloseOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
interface SectionProps {
	title: any;
	left?: any;
	right?: any;
	bottomLeft?: any;
	bottomRight?: any;
	bottom?: any;
	footer?: any;
	toggle?: any;
	manualInput?: any;
	manualMode?: number;
	videoSrc?: string;
}

export default function Section(props: SectionProps) {
	const [ videoUrl, setVideoUrl ] = useState<string>('');

	return (
		<Row justify="center" align="middle" style={{ maxWidth: '500px', margin: '1rem' }}>
			<Col span={24}>
				<h3
					style={{ cursor: props.videoSrc ? 'pointer' : 'auto' }}
					onClick={() => (props.videoSrc ? setVideoUrl(!videoUrl ? props.videoSrc as string : '') : true)}
				>
					{props.title}
					{` `}
					{props.videoSrc && (!videoUrl ? <YoutubeFilled /> : <CloseOutlined />)}
				</h3>
			</Col>
			{videoUrl && (
				<Col span={24}>
					<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
				</Col>
			)}
			{props.toggle && (
				<Fragment>
					<Col span={24} style={{ textAlign: 'end' }}>
						{props.toggle}
					</Col>
					<Col className="fields-divider" span={24} />
				</Fragment>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				<Col span={24}>{props.manualInput}</Col>
			) : (
				<Fragment>
					<Col span={24}>{props.left}</Col>
					<Col className="fields-divider" span={24} />
					<Col span={24}>{props.right}</Col>
					{props.bottom && (
						<Fragment>
							<Col className="fields-divider" span={24} />
							<Col span={24}>
								{props.bottomLeft}
								{props.bottom}
								{props.bottomRight}
							</Col>
						</Fragment>
					)}
					{props.footer && (
						<Fragment>
							<Col className="fields-divider" span={24} />
							<Col span={24} style={{ textAlign: 'center' }}>
								{props.footer}
							</Col>
						</Fragment>
					)}
				</Fragment>
			)}
		</Row>
	);
}
