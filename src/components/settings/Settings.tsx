import { Alert, Button, Col, Modal, Row, Tooltip, notification } from "antd";
import React, { Fragment, useState } from "react";
import TextInput from "../form/textinput";
import { COLORS } from "../../CONSTANTS";
import { SaveOutlined } from "@ant-design/icons";

export default function Setting() {
  const [mode, setMode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("Mehzabeen");
  const [contact, setContact] = useState<string>("8268552015");
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const SAVE_MODE = "Save";

  const save = () => {
    try {
      const otp = "12345";
      if (otp === "12345") setMode("");
      notification.success({
        message: "Otp Updated",
        description: `Success! Otp Updated.`,
      });
      return true;
    } catch (err) {
      notification.error({
        message: "Invalid Otp",
        description: "Sorry! Unable to update : " + err,
      });
      return false;
    }
  };

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
      <Row justify="center">
        <Col>
          <TextInput
            pre="Name"
            placeholder="Your Name"
            value={name}
            changeHandler={setName}
            fieldName="name"
            setError={setError}
            pattern="^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$"
            minLength={3}
          ></TextInput>
        </Col>
        <Col>
          <Tooltip title="Save">
            <Button
              type="link"
              style={{ color: COLORS.GREEN }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
      <p>&nbsp;</p>
      <Row justify="center">
        <Col>
          <TextInput
            pre="Contact"
            placeholder=""
            value={contact}
            changeHandler={setContact}
            fieldName="contact"
            setError={setError}
            minLength={8}
          ></TextInput>
        </Col>
        <Col>
          <Tooltip title="Save">
            <Button
              type="link"
              style={{ color: COLORS.GREEN }}
              icon={<SaveOutlined />}
              onClick={() => setMode(SAVE_MODE)}
            />
          </Tooltip>
        </Col>
      </Row>
      <p>&nbsp;</p>
      <Row justify="center">
        <Col>
          <TextInput
            pre="Email"
            placeholder=""
            value={email}
            changeHandler={setEmail}
            pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
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
              onClick={() => setMode(SAVE_MODE)}
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
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            setError={setError}
            minLength={8}
            maxLength={20}
            password
          ></TextInput>
        </Col>
        <Col>
          <Tooltip title="Save">
            <Button
              type="link"
              style={{ color: COLORS.GREEN }}
              icon={<SaveOutlined />}
              onClick={() => setMode(SAVE_MODE)}
            />
          </Tooltip>
        </Col>
      </Row>
      {mode && (
        <Modal
          title={`${mode} OTP`}
          visible={mode.length > 0}
          onCancel={() => setMode("")}
          onOk={() => (mode ? save() : null)}
          okText={"Save"}
          okButtonProps={{
            icon: <SaveOutlined />,
          }}
        >
          {error ? (
            <Fragment>
              <Alert type="error" message={error} />
              <p>&nbsp;</p>
            </Fragment>
          ) : null}
          <TextInput
            pre="OTP"
            placeholder="Enter Otp"
            value={otp}
            changeHandler={setOtp}
            fieldName="otp"
            setError={setError}
            minLength={5}
          ></TextInput>
        </Modal>
      )}
    </Fragment>
  );
}
