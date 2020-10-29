import React, { Fragment, ReactNode, useContext, useEffect } from 'react';
import ModalVideoPlayer from '../ModalVideoPlayer';
import { Row, Col } from 'antd';
import { CalcContext } from '../calc/CalcContext';
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
	const { fsb, allInputDone, setStepVideoUrl }: any = useContext(CalcContext);

	useEffect(() => {
		if (fsb.info.screenWidth >= 1024) setStepVideoUrl(props.videoSrc)
		else setStepVideoUrl("");
	}, [fsb.info.screenWidth]);
	
	return (
		<Row style={{maxWidth: '500px'}}>
			<Col span={24}>
				<h3 style={{textAlign: 'center'}}>
					{`${props.title} `}
					{props.videoSrc &&
					(allInputDone || fsb.info.screenWidth < 1024) && (
						<ModalVideoPlayer title={props.title} url={props.videoSrc} />
					)}
				</h3>
			</Col>
			{props.toggle && (
				<Col span={24} style={{ marginBottom: '0.5rem' }}>
					{props.toggle}
				</Col>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				<Col span={24} className="scrollbar" style={{marginRight: '1rem', maxHeight: '200px'}}>{props.manualInput}</Col>
			) : (
				React.Children.map(
					props.children,
					(child: any, i: number) =>
						child ? (
							<Fragment key={'section' + i}>
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
