import React, { Fragment } from "react";
import { Form, Input } from "antd";
import { Translations } from "@aws-amplify/ui-components";
import { useForm } from "antd/lib/form/Form";

interface StepOneProps {
  setEmail: Function;
  setPassword: Function;
  emailError: string;
  passwordError: string;
  setDisable: Function;
  setEmailError: Function;
  setPasswordError: Function;
}

export default function StepOne({
  setEmail,
  setPassword,
  emailError,
  setDisable,
  passwordError,
  setEmailError,
  setPasswordError
}: StepOneProps) {
  const [form] = useForm();

  const handleFormChange = () => {
    setEmailError('');
    setPasswordError('');
    setDisable(
      !form.isFieldTouched("password") ||
        !form.isFieldTouched("email") ||
        form.getFieldValue("email").length === 0 ||
        form.getFieldValue("password").length === 0
    );
  }

  return (
    <Fragment>
      <Form
        name="form"
        form={form}
        layout="vertical"
        onFieldsChange={handleFormChange}
      >
        <Form.Item
          name="email"
          label={Translations.EMAIL_LABEL}
          validateStatus={emailError ? "error" : undefined}
          help={emailError ? emailError : null}
          hasFeedback
        >
          <Input onChange={(e) => setEmail(e.currentTarget.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          label={Translations.PASSWORD_LABEL}
          validateStatus={passwordError ? "error" : undefined}
          help={passwordError ? passwordError : null}
          hasFeedback
        >
          <Input.Password
            allowClear
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </Form.Item>
      </Form>
    </Fragment>
  );
}
