import React, { useContext, useState } from "react";
import { Button, Modal, notification, Tooltip } from "antd";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import { Auth } from "aws-amplify";

interface OtpInputProps {
  onClickAction: Function;
  disableButton: boolean;
  action: string;
}

export default function OtpDialogue( props : OtpInputProps) {
  const { validateCaptcha }: any = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [otp, setOtp] = useState<any>();

  const confirmOtp = async (attr: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attr, otp)
      .then(() => {
        notification.success({ message: "Otp Verified Successfully" });
        setIsModalVisible(false);
      })
      .catch((err) => {
        notification.error({ message: "Wrong Otp " + err.message });
        setIsModalVisible(true);
      });
  };

  const handleOk = () => {
    confirmOtp(props.action);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onClick = () => {
    validateCaptcha(props.action).then((success: boolean) => {
      if (!success) return;
      props.onClickAction();
      showModal();
    });
  };

  return (
    <>
      <Tooltip title="Save">
        <Button
          type="link"
          style={{ color: COLORS.GREEN }}
          icon={<SaveOutlined />}
          disabled={props.disableButton}
          onClick={onClick}
        />
      </Tooltip>
      <Modal
        title={"Enter Otp"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={"Save"}
        okButtonProps={{ icon: <SaveOutlined /> }}
      >
        <TextInput pre="OTP" value={otp} changeHandler={setOtp} />
      </Modal>
    </>
  );
}
