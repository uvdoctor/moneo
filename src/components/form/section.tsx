import React, { Fragment, useState } from 'react';
import VideoPlayer from '../videoplayer';
import SVGPlay from '../svgplay';
import SVGStop from '../svgstop';
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
					<div onClick={() => setVideoUrl(!videoUrl ? props.videoSrc as string : '')}>
						<span>
							{!videoUrl ? <SVGPlay /> : <SVGStop />}
							Video
						</span>
					</div>
				)
			}
		>
			{videoUrl && (
				<p style={{textAlign: 'center'}}>
						<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
				</p>
			)}
			{props.toggle && (
				<p style={{textAlign: 'end'}}>
					{props.toggle}
				</p>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				props.manualInput
			) : (
				<Fragment>
					<Space align="start" size="large">
						{props.left}
						{props.right}
					</Space>
					{props.bottom && (
						<p style={{textAlign: 'center'}}>
							<Space align="center" size="large">
								{props.bottomLeft}
								{props.bottom}
								{props.bottomRight}
							</Space>
						</p>
					)}
					{props.footer && (
						<p style={{textAlign: 'center'}}>
							{props.footer}
						</p>
					)}
				</Fragment>
			)}
		</Card>
	);
}
