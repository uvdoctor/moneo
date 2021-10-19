import React, { useContext, useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";

interface ModalComponentProps {
  perform: Function | null;
  onClickAction: Function | null;
  disableModal: boolean;
  disableButton: boolean;
  action: string;
  icon: string;
  content: any;
}

export default function ModalComponent({
  perform,
  onClickAction,
  disableModal,
  disableButton,
  action,
  icon,
  content,
}: ModalComponentProps) {
  const { validateCaptcha }: any = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleOk = () => {
    if (perform)
      action.includes("email")
        ? perform("email")
        : action.includes("phone")
        ? perform("phone_number")
        : perform();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onClick = () => {
    validateCaptcha(action).then((success: boolean) => {
      if (!success) return;
      onClickAction ? onClickAction() : null;
      content ? showModal() : setIsModalVisible(false);
    });
  };

  return (
    <>
      <Tooltip title={icon}>
        <Button
          type="link"
          style={{ color: COLORS.GREEN }}
          icon={icon === "Save" ? <SaveOutlined /> : <EditOutlined />}
          disabled={disableButton}
          onClick={onClick}
        />
      </Tooltip>
      <Modal
        title={icon}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={"Save"}
        okButtonProps={{
          disabled: disableModal,
          icon: <SaveOutlined />,
        }}
      >
        {content}
      </Modal>
    </>
  );
}
