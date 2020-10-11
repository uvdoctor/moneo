import React, { Fragment, useState } from 'react';
import VideoPlayer from '../videoplayer';
import SVGPlay from '../svgplay';
import SVGStop from '../svgstop';
import { Row, Col, Card } from 'antd';
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
			style={{ width: 800 }}
		>
			{videoUrl && (
				<p>
					<VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
				</p>
			)}
			{props.toggle && <p>{props.toggle}</p>}
			{props.manualMode && props.manualMode > 0 ? (
				props.manualInput
			) : (
				<Fragment>
					<Row>
						<Col>{props.left}</Col>
						{props.right && <Col>{props.right}</Col>}
					</Row>
					{props.bottom && (
						<Row>
							{props.bottomLeft && <Col>{props.bottomLeft}</Col>}
							<Col>{props.bottom}</Col>
							{props.bottomRight && <Col>{props.bottomRight}</Col>}
						</Row>
					)}
					{props.footer && <p>{props.footer}</p>}
				</Fragment>
			)}
		</Card>
	);
}
