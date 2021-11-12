import React, { useContext, useState } from "react";
import { Button, Modal, notification, Tooltip } from "antd";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import { Auth } from "aws-amplify";
import { updateEmailInContact } from "../registrationutils";

interface OtpInputProps {
  onClickAction: Function;
  disableButton: boolean;
  action: string;
  email?: any;
  mob?: any;
  im?: any;
  notify?: any;
  cc?:any;
}

export default function OtpDialogue( props : OtpInputProps) {
  const { validateCaptcha }: any = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<any>();

  const confirmOtp = async (attr: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attr, otp)
      .then(async() => {
        notification.success({ message: "Otp Verified Successfully" });
        attr === 'email' && await updateEmailInContact(props.email, props.mob, props.im , props.notify);
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
    setLoading(true);
    validateCaptcha(props.action).then(async(success: boolean) => {
      if (!success) return;
      const data = await props.onClickAction();
      setLoading(false);
      if(!data) return;
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
          loading={loading}
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
