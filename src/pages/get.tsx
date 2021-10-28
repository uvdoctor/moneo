import { AmplifyAuthenticator, AmplifySection } from "@aws-amplify/ui-react";
import { AuthState } from "@aws-amplify/ui-components";
import React, { useState } from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify, { Auth, Hub } from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { FormInstance, useForm } from "antd/lib/form/Form";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { ROUTES } from "../CONSTANTS";

Amplify.configure(awsmobile);

function Get(this: any) {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
  const [disabledUserName, setDisabledUserName] = useState<boolean>(false);
  const [checkTC, setCheckTC] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputEl = React.createRef<FormInstance>();
  const [form] = useForm();
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleRegistrationSubmit = () => {
    if (checkTC) {
      setError("");
      Auth.signUp({
        username: user,
        password: password,
        attributes: {
          email: email,
        },
      })
        .then(async (response) => {
          Hub.dispatch("UI Auth", {
            event: "AuthStateChange",
            message: AuthState.ConfirmSignUp,
            data: {
              ...response.user,
              username: user,
              password: password,
              attributes: { email: email },
            },
          });
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
            <Input
              placeholder="Enter your Email Address"
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
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
            <Input.Password
              placeholder="Enter your password"
              allowClear
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
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
              onChange={(e) => setUser(e.currentTarget.value)}
            />
          </Form.Item>
          {error && <Alert message={error} type="error"></Alert>}
          <p>&nbsp;</p>
          <Row>
            <Col>
              <Checkbox
                onChange={(e) => setCheckTC(e.target.checked)}
                disabled={disabledUserName}
              >
                I accept the{" "}
                <a target="_blank" href={ROUTES.POLICYTC}>
                  Terms & Conditions
                </a>
                ,&nbsp;
                <a target="_blank" href={ROUTES.POLICYPRIVACY}>
                  Privacy Policy
                </a>{" "}
                &nbsp;and&nbsp;
                <a target="_blank" href={ROUTES.POLICYSECURITY}>
                  Security Policy
                </a>
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col>
              <Checkbox defaultChecked={true} disabled={disabledUserName}>
                Subscribe to Offer and NewsLetters
              </Checkbox>
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
