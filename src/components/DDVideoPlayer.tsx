import React, { Fragment, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Modal, notification, Row } from 'antd';
import Draggable from 'react-draggable';
import { YoutubeFilled } from '@ant-design/icons';
import LogoImg from './LogoImg';
import * as gtag from '../lib/gtag';

interface DDVideoPlayerProps {
	url: string;
	callback?: Function;
}

export default function DDVideoPlayer({ url, callback }: DDVideoPlayerProps) {
	const [ modalVisible, setModalVisible ] = useState<boolean>(false);
	const videoRef = useRef(null);

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		gtag.event({
			category: 'Video',
			action: 'Play',
			label: url,
			value: Math.round(
				//@ts-ignore
				videoRef.current?.getCurrentTime()) + " seconds"
		});
		setModalVisible(false);
		if (callback) callback();
	};

	return (
		<Fragment>
			<span style={{ cursor: 'pointer' }} onClick={openModal}>
				<YoutubeFilled />
			</span>
			{modalVisible && (
				<Modal
					centered
					title={<LogoImg />}
					footer={null}
					onCancel={closeModal}
					destroyOnClose
					visible={modalVisible}
					//@ts-ignore
					modalRender={(modal: any) => <Draggable>{modal}</Draggable>}
				>
					<Row style={{ paddingTop: '56.25%' }}>
						<ReactPlayer
							ref={videoRef}
							style={{ position: 'absolute', top: 60, left: 0 }}
							url={url}
							width="100%"
							height="100%"
							playing={url ? true : false}
							controls
							onEnded={closeModal}
							onError={() => {
								notification.error({
									message: 'Unable to Play Video',
									description: 'Sorry, an error occurred while trying to play the video!'
								});
								closeModal();
							}}
						/>
					</Row>
				</Modal>
			)}
		</Fragment>
	);
}
