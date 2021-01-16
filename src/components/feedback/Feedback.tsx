import { Modal } from "antd";
import React, { Fragment, useState } from "react";
import { useFullScreenBrowser } from 'react-browser-hooks';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

export default function Feedback() {
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const fsb = useFullScreenBrowser();

    const openModal = () => setModalVisible(true);

    const closeModal = () => setModalVisible(false);

    return (
        <Fragment>
			<span style={{ cursor: 'pointer' }} onClick={openModal}>
                <FontAwesomeIcon icon={faPenSquare} />
			</span>
            {modalVisible && (
                <Modal
                    centered
                    title={<div style={{ cursor: 'move' }}>Please provide your feedback</div>}
                    footer={null}
                    onCancel={closeModal}
                    destroyOnClose
                    visible={modalVisible}
                    //@ts-ignore
                    modalRender={(modal: any) => <Draggable disabled={fsb.info.innerWidth < 1200}>{modal}</Draggable>}
                >
                    Hello
                </Modal>
            )}
        </Fragment>    
    );
}
