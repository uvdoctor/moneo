import React, { Fragment, useState } from 'react';
import VideoPlayer from '../videoplayer';
import { VideoCameraOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
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
					<Button
						type="link"
						icon={!videoUrl ? <VideoCameraOutlined /> : <CloseCircleOutlined />}
						onClick={() => setVideoUrl(!videoUrl ? props.videoSrc as string : '')}
						danger={videoUrl ? true : false}
					>
						{videoUrl ? 'Stop' : 'Video'}
					</Button>
				)
			}
			style={{ maxWidth: '500px' }}
		>
			{videoUrl && <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />}
			{props.toggle && <div style={{ textAlign: 'end', marginBottom: '1rem' }}>{props.toggle}</div>}
			{props.manualMode && props.manualMode > 0 ? (
				props.manualInput
			) : (
				<Fragment>
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
							<Space align="center" size="large" style={{ marginTop: '1rem' }}>
								{props.bottomLeft}
								{props.bottom}
								{props.bottomRight}
							</Space>
						)}
					{props.footer && <div style={{ textAlign: 'center', marginTop: '1rem' }}>{props.footer}</div>}
				</Fragment>
			)}
		</Card>
	);
}
