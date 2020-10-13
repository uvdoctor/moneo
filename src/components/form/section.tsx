import React, { Fragment, useState } from 'react';
import VideoPlayer from '../videoplayer';
import { VideoCameraOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { isMobileDevice } from '../utils';
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
	const fsb = useFullScreenBrowser();

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
			style={{ maxWidth: isMobileDevice(fsb) ? `${fsb.info.screenWidth}px` : '600px' }}
		>
			{videoUrl && (
				<div style={{ textAlign: 'center' }}>
					<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
				</div>
			)}
			{props.toggle && <div style={{ textAlign: 'end' }}>{props.toggle}</div>}
			{props.manualMode && props.manualMode > 0 ? (
				props.manualInput
			) : (
				<Fragment>
					<Space align="center" direction="vertical" size="large">
						<Space
							//@ts-ignore
							align={`${isMobileDevice(fsb) ? 'center' : 'start'}`}
							size="large"
							//@ts-ignore
							direction={`${isMobileDevice(fsb) ? 'vertical' : 'horizontal'}`}
						>
							{props.left}
							{props.right}
						</Space>
						{props.bottom && (
							<div style={{ textAlign: 'center' }}>
								{props.bottomLeft}
								{props.bottom}
								{props.bottomRight}
							</div>
						)}
					</Space>
					{props.footer && <div style={{ textAlign: 'center' }}>{props.footer}</div>}
				</Fragment>
			)}
		</Card>
	);
}
