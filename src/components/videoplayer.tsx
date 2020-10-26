import React, { Fragment, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Modal, notification } from 'antd';
import Draggable from 'react-draggable';
import { YoutubeFilled } from '@ant-design/icons';

interface VideoPlayerProps {
	url: string;
	callback?: Function;
}

export default function VideoPlayer({ url, callback }: VideoPlayerProps) {
	const [ modalVisible, setModalVisible ] = useState<boolean>(false);

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
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
					title={null}
					footer={null}
					onCancel={closeModal}
					destroyOnClose
					visible={modalVisible}
					modalRender={(modal: any) => <Draggable>{modal}</Draggable>}
				>
					<div style={{ paddingTop: '56.25%' }}>
						<ReactPlayer
							style={{ position: 'absolute', top: 0, left: 0 }}
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
					</div>
				</Modal>
			)}
		</Fragment>
	);
}
