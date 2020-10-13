import React, { Fragment, useState } from 'react';
import VideoPlayer from '../videoplayer';
import { VideoCameraOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
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
	insideForm?: boolean;
	videoSrc?: string;
}

export default function Section(props: SectionProps) {
	const [ videoUrl, setVideoUrl ] = useState<string>('');

	return (
		<Card
			title={props.title}
			bordered={false}
			extra={
				props.videoSrc && (
					<div
						style={{ cursor: 'pointer' }}
						onClick={() => setVideoUrl(!videoUrl ? props.videoSrc as string : '')}
					>
						<span style={{ textAlign: 'center' }}>
							{!videoUrl ? <VideoCameraOutlined /> : <CloseCircleOutlined />}
							Video
						</span>
					</div>
				)
			}
		>
			{videoUrl && (
				<div style={{ textAlign: 'center' }}>
					<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
				</div>
			)}
			{props.toggle && <p style={{ textAlign: 'end' }}>{props.toggle}</p>}
			{props.manualMode && props.manualMode > 0 ? (
				props.manualInput
			) : (
				<Fragment>
					<Space align="start" size="large">
						{props.left}
						{props.right}
					</Space>
					{props.bottom && (
						<p style={{ textAlign: 'center' }}>
							<Space align="center" size="large">
								{props.bottomLeft}
								{props.bottom}
								{props.bottomRight}
							</Space>
						</p>
					)}
					{props.footer && <p style={{ textAlign: 'center' }}>{props.footer}</p>}
				</Fragment>
			)}
		</Card>
	);
}
