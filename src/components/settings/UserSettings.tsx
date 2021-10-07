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
import { useForm } from "antd/lib/form/Form";

export default function UserSettings() {
  const { validateCaptcha, user, appContextLoaded }: any = useContext(AppContext);
  const [mode, setMode] = useState<string>("");
  const [email, setEmail] = useState<string>(user?.attributes.email);
  const [password, setPassword] = useState<string>("**********");
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [rePass, setRePass] = useState<string>("");
  const [counCode, setCounCode] = useState<string>("");
  const [disabledForm, setDisabledForm] = useState(true);
  const [contact, setContact] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [attrName, setAttrName] = useState<string>("");

  const SAVE_MODE = "Save";
  const EDIT_MODE = "Edit";
  const [form] = useForm();

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length) || !form.isFieldsTouched(true);
    setDisabledForm(hasErrors);
  }

  const handleInputChange = (fieldValue: any, userAttr: any) => {
    let bool;
    bool = (fieldValue === userAttr) ? true : (error.length > 0) ? true : false;
    return bool
  }

  const update = async (attr: string, attrValue: any) => {
    try {
      const data = await Auth.updateUserAttributes(user, {
        [attr]: attrValue,
      });
      notification.success({
        message: `${attrName} Updated`,
        description: `${data} "Verify your ${attrName} by entering Otp`,
      });
      setMode(SAVE_MODE);
    } catch (error) {
      notification.error({
        message: `Unable to update ${attrName}`,
        description: "Sorry! Unable to update : " + error,
      });
    }
  };

  const confirmOtp = async (attrValue: any) => {
    Auth.verifyCurrentUserAttributeSubmit(attrName, attrValue)
      .then(() => {
        notification.success({
          message: `${attrName} Verified`,
          description: "Otp Verified Successfully",
        });
        setMode("");
        return true;
      })
      .catch((err) => {
        notification.error({
          message: "Wrong Otp",
          description: "Sorry! Unable to update : " + err.message,
        });
        setMode("");
        return false;
      });
    return true;
  };

  const editPassword = async () => {
    Auth.changePassword(user, oldPass, newPass)
      .then((data) => {
        notification.success({
          message: "Password Updated",
          description: `Password Updated Status: ${data}`,
        });
        setMode("");
        return true;
      })
      .catch((err) => {
        notification.error({
          message: "Wrong Credentials",
          description: "Sorry! Unable to update : " + err.message,
        });
        setMode("");
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
                  disabled={handleInputChange(user.attributes.phone_number, `${counCode}${contact}`)}
                  onClick={() => {
                    validateCaptcha("phone_change").then((success: boolean) => {
                      if (!success) {
                        console.log("Bot");
                        return
                      };
                      setAttrName(`phone_number`)
                      update(attrName, `${counCode}${contact}`);
                    })
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
                  disabled={handleInputChange(email, user.attributes.email)}
                  onClick={() => {
                    validateCaptcha("email_change").then((success: boolean) => {
                      if (!success) {
                        console.log("Bot");
                        return
                      };
                      setAttrName("email")
                      update(attrName, email);
                    })


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
              <Tooltip title="Edit">
                <Button
                  type="link"
                  style={{ color: COLORS.GREEN }}
                  icon={<EditOutlined />}
                  onClick={() => {
                    validateCaptcha("password_change").then((success: boolean) => {
                      if (!success) {
                        console.log("Bot");
                        return
                      };
                      setMode(EDIT_MODE)
                    })
                  }}
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
            disabled: disabledForm,
            icon: <SaveOutlined />,
          }}
        >
          {error ? (
            <Fragment>
              <Alert type="error" message={error} />
              <p>&nbsp;</p>
            </Fragment>
          ) : null}
          <Form name="submit" layout="vertical" form={form} onFieldsChange={handleFormChange}>
            <Form.Item
              name="Old Password"
              label="Enter Your Old Password"
              required={true}
            >
              <Input.Password
                allowClear
                value={oldPass}
                onChange={(e) => setOldPass(e.currentTarget.value)}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              required={true}
              rules={[
                {
                  min: 8,
                  max: 10,
                  message: "Password must be between 8-20 length"
                },
                {
                  pattern: new RegExp("(?=.*[a-z])"),
                  message: "Atleast one lowercase"
                }, {
                  pattern: new RegExp("(?=.*[A-Z])"),
                  message: "Atleast one uppercase"
                },
                {
                  pattern: new RegExp(".*[0-9].*"),
                  message: "Atleast one digit"
                },
                {
                  pattern: new RegExp("(?=.*[!@#$%^&*])"),
                  message: "Atleast one special characters"
                }
              ]}
            >
              <Input.Password
                allowClear
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
                  validator(_, value, callback) {
                    if (getFieldValue("newPassword") === value) return callback();
                    return callback(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                allowClear
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
