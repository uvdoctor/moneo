import React from "react";
import { Row, Col, Image } from "antd";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";
import "./Step.less";
//import GetStartedButton from "./GetStartedButton";

interface StepProps {
	className: string;
	count: string;
	title: string;
	subTitle: string;
	content: string;
	imgSrc: any;
}

export default function Step({
	className,
	count,
	title,
	subTitle,
	content,
	imgSrc,
}: StepProps) {
	const fsb = useFullScreenBrowser();

	return (
		<Col xs={24} sm={24} md={12}>
			<div className={`step ${className}`}>
				<Row justify="space-around" align="middle">
					<Col flex="90px" className="count">
						{count}
					</Col>
					<Col flex="auto">
						<hgroup>
							<h2>{title}</h2>
							<h3>{subTitle}</h3>
						</hgroup>
					</Col>
				</Row>
				<p>{content}</p>
				<Image preview={isMobileDevice(fsb) ? true : false} src={imgSrc} />
				<p style={{ textAlign: "center" }}>
					{/*<GetStartedButton />*/}
					<button className="btn-3d">Start</button>
				</p>
			</div>
		</Col>
	);
}
