import {
  Alert,
  Button,
  Col,
  Modal,
  Row,
  Tooltip,
  notification,
  Skeleton,
  Form,
  Input,
} from "antd";
import React, { Fragment, useContext, useState, useEffect } from "react";
import TextInput from "../form/textinput";
import { COLORS } from "../../CONSTANTS";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { Auth } from "aws-amplify";

export default function UserSettings() {
  const { user, appContextLoaded }: any = useContext(AppContext);
  const [mode, setMode] = useState<string>("");
  const [email, setEmail] = useState<string>(user?.attributes.email);
  const [password, setPassword] = useState<string>("**********");
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [rePass, setRePass] = useState<string>("");
  const [counCode, setCounCode] = useState<string>("");
  // const [name, setName] = useState<string>(user);
  const [contact, setContact] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const SAVE_MODE = "Save";
  const EDIT_MODE = "Edit";

  const update = async (attr: string, attrValue: any) => {
    try {
      const data = await Auth.updateUserAttributes(user, {
        [attr]: attrValue,
      });
      notification.success({
        message: "Email Updated",
        description: `${data} "Verify your email Address by entering Otp`,
      });
    } catch (error) {
      notification.error({
        message: `Unable to update ${attr}`,
        description: "Sorry! Unable to update : " + error,
      });
    }
  };

  const confirmOtp = async (attrValue: any) => {
    const attr = attrValue.includes("@") ? "email" : "phone_number";
    Auth.verifyCurrentUserAttributeSubmit(attr, attrValue)
      .then(() => {
        notification.success({
          message: `${attr} Verified`,
          description: "Otp Verified Successfully",
        });
        return true;
      })
      .catch((err) => {
        notification.error({
          message: "Wrong Otp",
          description: "Sorry! Unable to update : " + err.message,
        });
        return false;
      });
  };

  const editPassword = async () => {
    Auth.changePassword(user, oldPass, newPass)
      .then((data) => {
        notification.success({
          message: "Password Updated",
          description: `Password Updated Status: ${data}`,
        });
        return true;
      })
      .catch((err) => {
        notification.error({
          message: "Wrong Credentials",
          description: "Sorry! Unable to update : " + err.message,
        });
        return false;
      });
  };

  useEffect(() => {
    if (!user) return;
    const phoneNum = user.attributes.phone_number;
    setContact(user.attributes.phone_number);
    setEmail(user.attributes.email);
    setCounCode(phoneNum.slice(0, phoneNum.indexOf(1) + 1));
    setContact(phoneNum.slice(phoneNum.indexOf(1) + 1));
  }, [appContextLoaded]);

  return (
    <Fragment>
      {error ? (
        <Fragment>
          <Alert type="error" message={error} />
          <p>&nbsp;</p>
        </Fragment>
      ) : null}
      <Row justify="center">Settings</Row>
      <p>&nbsp;</p>
      {appContextLoaded ? (
        <>
          <Row justify="center">
            <Col>
              <TextInput
                pre="Contact"
                prefix={counCode}
                value={contact}
                changeHandler={setContact}
                fieldName="contact"
                pattern="^[0-9]"
                setError={setError}
                minLength={10}
              />
            </Col>
            <Col>
              <Tooltip title="Save">
                <Button
                  type="link"
                  style={{ color: COLORS.GREEN }}
                  icon={<SaveOutlined />}
                  disabled={
                    user.attributes.phone_number === `${counCode}${contact}`
                      ? true
                      : false
                  }
                  onClick={() => {
                    setMode(SAVE_MODE);
                    update(`phone_number`, `${counCode}${contact}`);
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          <p>&nbsp;</p>
          <Row justify="center">
            <Col>
              <TextInput
                pre="Email Id"
                value={email}
                changeHandler={setEmail}
                pattern="^(?!.*(?:\.-|-\.))[^@]+@[^\W_](?:[\w-]*[^\W_])?(?:\.[^\W_](?:[\w-]*[^\W_])?)+$"
                setError={setError}
                fieldName="email"
                minLength={8}
              />
            </Col>
            <Col>
              <Tooltip title="Save">
                <Button
                  type="link"
                  style={{ color: COLORS.GREEN }}
                  icon={<SaveOutlined />}
                  disabled={email === user.attributes.email ? true : false}
                  onClick={() => {
                    setMode(SAVE_MODE);
                    update("email", email);
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          <p>&nbsp;</p>
          <Row justify="center">
            <Col>
              <TextInput
                pre="Password"
                value={password}
                changeHandler={setPassword}
                fieldName="Password"
                setError={setError}
                disabled={true}
              ></TextInput>
            </Col>
            <Col>
              <Tooltip title="Save">
                <Button
                  type="link"
                  style={{ color: COLORS.GREEN }}
                  icon={<SaveOutlined />}
                  onClick={() => setMode(EDIT_MODE)}
                />
              </Tooltip>
            </Col>
          </Row>
        </>
      ) : (
        <Skeleton active />
      )}
      {mode && (
        <Modal
          title={`${mode}`}
          visible={mode === "Edit"}
          onCancel={() => setMode("")}
          onOk={() => (mode === "Edit" ? editPassword() : null)}
          okText={"Save"}
          okButtonProps={{
            icon: <EditOutlined />,
          }}
        >
          {error ? (
            <Fragment>
              <Alert type="error" message={error} />
              <p>&nbsp;</p>
            </Fragment>
          ) : null}
          <Form name="submit" layout="vertical">
            <Form.Item
              name="Old Password"
              label="Enter Your Old Password"
              rules={[
                {
                  required: true,
                  message: "Old password required",
                },
              ]}
            >
              <Input
                value={oldPass}
                onChange={(e) => setOldPass(e.currentTarget.value)}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Password Required",
                },
                {
                  pattern: new RegExp(
                    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$"
                  ),
                  message:
                    "Password must have atleast 8 characters, and contain atleast one uppercase, lowercase, number and special character.",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                value={newPass}
                onChange={(e) => setNewPass(e.currentTarget.value)}
              />
            </Form.Item>
            <Form.Item
              name="reenterPassword"
              label="Re-enter Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  // @ts-ignore
                  validator(rule, value, callback) {
                    if (getFieldValue("newPassword") === value) {
                      return callback();
                    }
                    return callback(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                value={rePass}
                onChange={(e) => setRePass(e.currentTarget.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {mode && (
        <Modal
          title={`${mode}`}
          visible={mode === "Save"}
          onCancel={() => setMode("")}
          onOk={() => (mode === "Save" ? confirmOtp(otp) : null)}
          okText={"Save"}
          okButtonProps={{
            icon: <SaveOutlined />,
          }}
        >
          <TextInput
            pre="OTP"
            value={otp}
            changeHandler={setOtp}
            fieldName="otp"
            setError={setError}
          ></TextInput>
        </Modal>
      )}
    </Fragment>
  );
}
