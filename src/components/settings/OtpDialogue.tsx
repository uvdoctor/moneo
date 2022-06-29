import React, { Fragment, useContext, useState } from "react";
import { Button, Modal, notification, Tooltip } from "antd";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import { Auth } from "aws-amplify";
import { updateUserDetails } from "../userinfoutils";
import Countdown from "antd/lib/statistic/Countdown";
import { UserSettingsContext } from "./UserSettingsContext";

interface OtpInputProps {
  onClickAction: Function;
  disableButton: boolean;
  action: string;
  email?: any;
  mob?: any;
  im?: any;
}

export default function OtpDialogue({
  onClickAction,
  disableButton,
  action,
  email,
  mob,
}: OtpInputProps) {
  const { owner }: any = useContext(AppContext);
  const { sendOtp }: any = useContext(UserSettingsContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<any>();
  const [viewResendOtp, setViewResendOtp] = useState<boolean>(false);
  const targetTime = Date.now() + 10 * 6000;

  const confirmOtp = async (attr: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attr, otp)
      .then(async () => {
        notification.success({ message: "Otp Verified Successfully" });
        if (attr === "phone_number") {
          await updateUserDetails({ uname: owner, mob });
        } else {
          await updateUserDetails({ uname: owner, email });
        }
        setLoading(false);
        setIsModalVisible(false);
      })
      .catch((err) => {
        notification.error({ message: "Wrong Otp " + err.message });
        setLoading(false);
        setIsModalVisible(true);
      });
  };

  const callResendOtp = async () => {
    await sendOtp();
    setViewResendOtp(false);
  };

  const handleOk = (action: string) => {
    setLoading(true);
    confirmOtp(action);
  };

  const handleCancel = () => {
    setLoading(false);
    setViewResendOtp(false);
    setIsModalVisible(false);
  };

  const onClick = async () => {
    setLoading(true);
    const data = await onClickAction();
    setLoading(false);
    if (!data) return;
    setIsModalVisible(true);
  };

  return (
    <Fragment>
      <Tooltip title="Save">
        <Button
          type="link"
          style={{ color: COLORS.GREEN }}
          icon={<SaveOutlined />}
          id={action}
          disabled={disableButton}
          onClick={onClick}
          loading={loading}
        />
      </Tooltip>
      <Modal
        centered={true}
        title={"Enter Otp"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button type="dashed" key="resend" onClick={callResendOtp}>
            {viewResendOtp ? (
              "Resend Otp"
            ) : (
              <Countdown
                valueStyle={{ fontSize: "15px", color: COLORS.GREEN }}
                value={targetTime}
                format={"mm:ss"}
                onFinish={() => setViewResendOtp(true)}
              />
            )}
          </Button>,
          <Button type="link" key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            type="primary"
            key="submit"
            onClick={() => handleOk(action)}
            icon={<SaveOutlined />}
            disabled={!otp}
            loading={loading}
          >
            Submit
          </Button>,
        ]}
      >
        <TextInput pre="Otp" value={otp} changeHandler={setOtp} inline />
      </Modal>
    </Fragment>
  );
}
