import React, { Fragment, useState } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import { YoutubeFilled } from '@ant-design/icons';
import DDVideoPlayer from './DDVideoPlayer';
import { useFullScreenBrowser } from 'react-browser-hooks';
interface ModalVideoPlayerProps {
	title: string;
	url: string;
}

export default function ModalVideoPlayer({ title, url }: ModalVideoPlayerProps) {
	const [ modalVisible, setModalVisible ] = useState<boolean>(false);
	const fsb = useFullScreenBrowser();

	const openModal = () => setModalVisible(true);

	const closeModal = () => setModalVisible(false);

	return (
		<Fragment>
			<span style={{ cursor: 'pointer' }} onClick={openModal}>
				<YoutubeFilled />
			</span>
			{modalVisible && (
				<Modal
					centered
					title={<div style={{ cursor: 'move' }}>{title}</div>}
					footer={null}
					onCancel={closeModal}
					destroyOnClose
					visible={modalVisible}
					//@ts-ignore
					modalRender={(modal: any) => <Draggable disabled={fsb.info.screenWidth < 1200}>{modal}</Draggable>}
				>
					<DDVideoPlayer url={url} callback={closeModal} />
				</Modal>
			)}
		</Fragment>
	);
}
