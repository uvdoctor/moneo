import React, { Fragment, ReactNode, useContext, useEffect } from "react";
import ModalVideoPlayer from "../ModalVideoPlayer";
import { Row, Col } from "antd";
import { CalcContext } from "../calc/CalcContext";
interface SectionProps {
	title: any;
	footer?: any;
	toggle?: any;
	manualInput?: any;
	manualMode?: number;
	videoSrc?: string;
	children?: ReactNode;
	error?: string;
}

export default function Section(props: SectionProps) {
	const { fsb, allInputDone, setStepVideoUrl }: any = useContext(CalcContext);

	useEffect(() => {
		if (fsb.info.screenWidth >= 1024) setStepVideoUrl(props.videoSrc);
		else setStepVideoUrl("");
	}, [fsb.info.screenWidth]);

	return (
		<Row>
			<Col span={24}>
				<h3 className="steps-heading">
					{`${props.title} `}
					{props.videoSrc && (allInputDone || fsb.info.screenWidth < 1024) && (
						<ModalVideoPlayer title={props.title} url={props.videoSrc} />
					)}
				</h3>
			</Col>
			{props.toggle && (
				<Col span={24} style={{ marginBottom: "0.5rem" }}>
					{props.toggle}
				</Col>
			)}
			{props.error && <div className="error-txt">{props.error}</div>}
			{props.manualMode && props.manualMode > 0 ? (
				<Col span={24}>{props.manualInput}</Col>
			) : (
				React.Children.map(props.children, (child: any, i: number) =>
					child ? (
						<Col span={24} key={"section" + i}>
							<Col span={24}>{child}</Col>
							<Col className="fields-divider" span={24} />
						</Col>
					) : null
				)
			)}
			{props.footer && (
				<Fragment>
					<Col span={24}>{props.footer}</Col>
					<Col className="fields-divider" span={24} />
				</Fragment>
			)}
		</Row>
	);
}
