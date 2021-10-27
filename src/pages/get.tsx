import { AmplifyAuthenticator, AmplifySection } from "@aws-amplify/ui-react";
import React, { useState } from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify, { Auth } from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { FormInstance, useForm } from "antd/lib/form/Form";
import Checkbox from "antd/lib/checkbox/Checkbox";

Amplify.configure(awsmobile);

function Get(this: any) {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
  const [disabledUserName, setDisabledUserName] = useState<boolean>(false);
  const [checkTC, setCheckTC] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputEl = React.createRef<FormInstance>();
  const [form] = useForm();

  const handleRegistrationSubmit = () => {
    setError("");
    if (checkTC) {
      const value = (name: string) => inputEl.current?.getFieldValue(name);
      Auth.signUp({
        username: value("username"),
        password: value("password"),
        attributes: {
          email: value("email"),
        },
      })
        .then((response) => {
          console.log("Auth.signIn success", response);
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      setError("Please accept the terms and conditions");
    }
  };

  const handleFormChange = () => {
    const fieldErr = (name: string) => form.getFieldError(name).length > 0;
    const fieldTouch = (name: string) => !form.isFieldTouched(name);

    setDisabledUserName(
      fieldErr("email") ||
        fieldErr("password") ||
        fieldTouch("email") ||
        fieldTouch("password")
    );
    setDisabledSubmit(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );
  };

  return (
    <AmplifyAuthenticator>
      <AmplifySection slot="sign-up">
        <h3>Sign Up</h3>
        <Form
          name="signUp"
          layout="vertical"
          size="large"
          form={form}
          onFieldsChange={handleFormChange}
          ref={inputEl}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              {
                required: true,
                pattern:
                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Enter a valid email address",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your Email Address" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                min: 8,
                max: 20,
                message: "Password must be between 8-20 length",
              },
              {
                pattern: new RegExp("(?=.*[a-z])"),
                message: "Atleast one lowercase",
              },
              {
                pattern: new RegExp("(?=.*[A-Z])"),
                message: "Atleast one uppercase",
              },
              {
                pattern: new RegExp(".*[0-9].*"),
                message: "Atleast one digit",
              },
              {
                pattern: new RegExp("(?=.*[!@#$%^&*])"),
                message: "Atleast one special characters",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter your password" allowClear />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            required={true}
            rules={[
              {
                required: true,
                min: 2,
                message: "Username cannot be empty",
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Enter your username"
              disabled={disabledUserName}
            />
          </Form.Item>
          {error && <Alert message={error}></Alert>}
          <p>&nbsp;</p>
          <Row>
            <Col>
              <Checkbox
                onChange={(e) => {
                  e.target.checked ? setCheckTC(true) : setCheckTC(false);
                }}
                disabled={disabledUserName}
              />
            </Col>
            <Col>
              <label>Terms and Conditions</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Checkbox defaultChecked={true} disabled={disabledUserName} />
            </Col>
            <Col>
              <label>Subscribe to Offer and NewsLetter</label>
            </Col>
          </Row>
          <p>&nbsp;</p>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabledSubmit}
              onClick={handleRegistrationSubmit}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </AmplifySection>
      <BasicPage title="Get Real-time Analysis">
        <NWContextProvider />
      </BasicPage>
    </AmplifyAuthenticator>
  );
}

export default Get;
