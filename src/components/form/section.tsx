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
			style={{ width: 1000 }}
		>
			{videoUrl && (
				<p>
					<Space align="center">
						<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
					</Space>	
				</p>
			)}
			{props.toggle && (
				<p>
					<Space align="end">{props.toggle}</Space>
				</p>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				props.manualInput
			) : (
				<Fragment>
					<Space align="center" size="large">
						{props.left}
						{props.right}
					</Space>
					{props.bottom && (
						<p>
							<Space align="center">
								{props.bottomLeft}
								{props.bottom}
								{props.bottomRight}
							</Space>
						</p>
					)}
					{props.footer && (
						<p>
							<Space align="center">{props.footer}</Space>
						</p>
					)}
				</Fragment>
			)}
		</Card>
	);
}
