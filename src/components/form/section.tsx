import React, { Fragment, useState, ReactNode } from 'react';
import VideoPlayer from '../videoplayer';
import { YoutubeFilled } from '@ant-design/icons';
import { Row, Col, Modal } from 'antd';
import LogoImg from '../LogoImg';
import Draggable from 'react-draggable';

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
	const [ modalVisible, setModalVisible ] = useState<boolean>(false);
	const [ modalMoveDisabled, setModalMoveDisabled ] = useState<boolean>(true);

	const toggleModalVisibility = () => setModalVisible(!modalVisible);

	return (
		<Row justify="center" align="middle" style={{ maxWidth: '500px', maxHeight: '500px' }}>
			<Col span={24}>
				<h3
					style={{ cursor: props.videoSrc && !modalVisible ? 'pointer' : 'auto', marginRight: '0.5rem' }}
					onClick={() => (props.videoSrc && !modalVisible ? toggleModalVisibility() : true)}
				>
					{`${props.title} `}
					{props.videoSrc && !modalVisible ? <YoutubeFilled /> : null}
				</h3>
			</Col>
			{modalVisible && (
				<Modal
					centered
					visible={modalVisible}
					title={
						<div
							style={{
								width: '100%',
								cursor: 'move'
							}}
							onMouseOver={() => setModalMoveDisabled(false)}
							onMouseOut={() => setModalMoveDisabled(true)}
						>
							<LogoImg />
						</div>
					}
					okText="Done"
					onOk={toggleModalVisibility}
					onCancel={toggleModalVisibility}
					destroyOnClose
					modalRender={(modal: any) => <Draggable disabled={modalMoveDisabled}>{modal}</Draggable>}
				>
					<VideoPlayer url={props.videoSrc as string} urlHandler={toggleModalVisibility} />
				</Modal>
			)}
			{props.toggle && (
				<Col span={24} style={{ marginBottom: '0.5rem' }}>
					{props.toggle}
				</Col>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				<Col span={24}>{props.manualInput}</Col>
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
