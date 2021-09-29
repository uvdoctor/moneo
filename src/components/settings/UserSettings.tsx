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
  const [password, setPassword] = useState<string>("********");
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [rePass, setRePass] = useState<string>("");
  // const [name, setName] = useState<string>(user);
  // const [contact, setContact] = useState<string>(user?.attributes.phone_number);
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  // const update = async () => {
  //   const data = await Auth.updateUserAttributes(user, {
  //     email: email,
  //   });
  //   alert(data);
  // let result = await Auth.verifyCurrentUserAttributeSubmit("email", otp);
  //       alert(result);
  // };

  const SAVE_MODE = "Save";

  const save = async () => {
    if (newPass) {
      setMode("");
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
      setOldPass("");
      setNewPass("");
    }
  };

  useEffect(() => {
    if (!user) return;
    setEmail(user.attributes.email);
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
                pre="Email"
                placeholder=""
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
                  onClick={() => {
                    setMode(SAVE_MODE);
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
                placeholder=""
                value={password}
                changeHandler={setPassword}
                fieldName="Password"
                setError={setError}
              ></TextInput>
            </Col>
            <Col>
              <Tooltip title="Save">
                <Button
                  type="link"
                  style={{ color: COLORS.GREEN }}
                  icon={<EditOutlined />}
                  onClick={() => setMode(SAVE_MODE)}
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
          visible={mode.length > 0}
          onCancel={() => setMode("")}
          onOk={() => (mode ? save() : null)}
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
              validateStatus="error"
              help="Should be combination of numbers & alphabets"
              rules={[
                {
                  required: true,
                  min: 8,
                  type: "string",
                  message: "Please enter your old password",
                },
              ]}
            >
              <Input
                placeholder="Enter"
                value={oldPass}
                id = "error"
                onChange={(e) => setOldPass(e.currentTarget.value)}
              />
            </Form.Item>
            <Form.Item
            
              name="New Password"
              label="New Password"
              validateStatus="warning"
              rules={[
                {
                  required: true,
                  type: "string", 
                  message: "Please enter a new valid password",
                  max: 20,
                  min: 8,

                },
              ]}
            >
              <Input
                placeholder="Enter"
                id = "warning"
                value={newPass}
                onChange={(e) => setNewPass(e.currentTarget.value)}
                pattern={
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$"
                }
              />
            </Form.Item>
            <Form.Item
              name="Re-enter Password"
              label="Re-enter Password"
              rules={[
                {
                  required: true,
                  type: "string",
                  message: "Enter the New Password Again",
                  min: 8,
                  max: 20,
                },
              ]}
            >
              <Input
                placeholder="Enter"
                value={rePass}
                onChange={(e) => setRePass(e.currentTarget.value)}
                pattern={newPass}
              />
            </Form.Item>
          </Form>
          {/* <TextInput
            pre="Old Password"
            placeholder="Enter Your Old Password"
            value={oldPass}
            changeHandler={setOldPass}
            fieldName="oldpass"
            setError={setError}
            minLength={6}
          ></TextInput>
          <p>&nbsp;</p>
          <TextInput
            pre="New Password"
            placeholder="Enter Your New Password"
            value={newPass}
            changeHandler={setNewPass}
            fieldName="newPass"
            setError={setError}
            minLength={6}
          ></TextInput> */}
        </Modal>
      )}
    </Fragment>
  );
}

// {mode && (
//   <Modal
//     title={`${mode} OTP`}
//     visible={mode.length > 0}
//     onCancel={() => setMode("")}
//     onOk={() => (mode ? save() : null)}
//     okText={"Save"}
//     okButtonProps={{
//       icon: <SaveOutlined />,
//     }}
//   >
//     {error ? (
//       <Fragment>
//         <Alert type="error" message={error} />
//         <p>&nbsp;</p>
//       </Fragment>
//     ) : null}
//     <TextInput
//       pre="OTP"
//       placeholder="Enter Otp"
//       value={otp}
//       changeHandler={setOtp}
//       fieldName="otp"
//       setError={setError}
//       minLength={3}
//     ></TextInput>
//   </Modal>
// )}
