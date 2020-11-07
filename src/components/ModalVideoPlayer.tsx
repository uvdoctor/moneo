import React, { Fragment, useState } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import { YoutubeFilled } from '@ant-design/icons';
import VideoPlayer from './VideoPlayer';

interface ModalVideoPlayerProps {
	title: string;
	url: string;
}

export default function ModalVideoPlayer({ title, url }: ModalVideoPlayerProps) {
	const [ modalVisible, setModalVisible ] = useState<boolean>(false);

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	return (
		<Fragment>
			<span style={{ cursor: 'pointer' }} onClick={openModal}>
				<YoutubeFilled />
			</span>
			{modalVisible && (
				<Modal
					centered
					title={<div style={{cursor: 'move'}}>{title}</div>}
					footer={null}
					onCancel={closeModal}
					destroyOnClose
					visible={modalVisible}
					//@ts-ignore
					modalRender={(modal: any) => <Draggable>{modal}</Draggable>}
				>
					<VideoPlayer url={url} callback={closeModal} />	
				</Modal>
			)}
		</Fragment>
	);
}
