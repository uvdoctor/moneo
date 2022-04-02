import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Modal, notification, Tooltip } from "antd";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import { Auth } from "aws-amplify";
import { updateUserDetails } from "../userinfoutils";
import Countdown from "antd/lib/statistic/Countdown";

interface OtpProps {
  action: string;
  email?: any;
  mob?: any;
  signupDone?: boolean;
  title?: string;
  onClickAction?: Function;
  disableButton?: boolean;
  setVerifyPhone?: Function;
}

export default function Otp({
  action,
  email,
  mob,
  signupDone,
  title,
  onClickAction,
  disableButton,
  setVerifyPhone
}: OtpProps) {
  const { owner, validateCaptcha, setUser }: any = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<any>();
  const [viewResendOtp, setViewResendOtp] = useState<boolean>(false);
  const targetTime = Date.now() + 10 * 6000;

  const confirmOtp = async (attr: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attr, otp)
      .then(async (data) => {
        console.log(data)
        setUser(await Auth.currentAuthenticatedUser());
        notification.success({ message: "Otp Verified Successfully" });
        setVerifyPhone && setVerifyPhone(true);
        if(!signupDone) {
        if (attr === "phone_number") {
          await updateUserDetails({ uname: owner, mob });
        } else {
          await updateUserDetails({ uname: owner, email });
        }
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
    console.log("+" + mob, mob);
    const re = await Auth.resendSignUp("+" + mob);
    console.log(re);
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

  const onClick = () => {
    setLoading(true);
    validateCaptcha(action).then(async (success: boolean) => {
      if (!success) return;
      const data = onClickAction && (await onClickAction());
      setLoading(false);
      if (!data) return;
      setIsModalVisible(true);
    });
  };

  useEffect(() => {
    if (signupDone) setIsModalVisible(true);
  }, [signupDone]);

  return (
    <Fragment>
      {!signupDone && (
        <Tooltip title="Save">
          <Button
            type="link"
            style={{ color: COLORS.GREEN }}
            icon={<SaveOutlined />}
            disabled={disableButton}
            onClick={onClick}
            loading={loading}
          />
        </Tooltip>
      )}
      <Modal
        centered={true}
        title={title ? title : "Enter Otp"}
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
