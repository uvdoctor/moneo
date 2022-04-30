import React, { Fragment } from "react";
import { Form, Input } from "antd";
import { Translations } from "@aws-amplify/ui-components";
import { useForm } from "antd/lib/form/Form";

interface StepOneProps {
  setEmail: Function;
  setPassword: Function;
  emailError: string;
  setDisable: Function;
}

export default function StepOne({
  setEmail,
  setPassword,
  emailError,
  setDisable,
}: StepOneProps) {
  const [form] = useForm();

  const handleFormChange = () =>
    setDisable(
      form.getFieldError("password").length > 0 ||
        !form.isFieldTouched("password") ||
        form.getFieldError("email").length > 0 ||
        !form.isFieldTouched("email") ||
        form.getFieldValue("email").length === 0 ||
        form.getFieldValue("password").length === 0
    );

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
          rules={[
            {
              pattern:
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "This is not a valid email address",
            },
          ]}
          hasFeedback
        >
          <Input onChange={(e) => setEmail(e.currentTarget.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          label={Translations.PASSWORD_LABEL}
          rules={[
            {
              min: 8,
              max: 20,
              message: "Password must be between 8-20 characters",
            },
            {
              pattern: new RegExp("(?=.*[a-z])"),
              message: "At least one lowercase",
            },
            {
              pattern: new RegExp("(?=.*[A-Z])"),
              message: "At least one uppercase",
            },
            {
              pattern: new RegExp(".*[0-9].*"),
              message: "At least one digit",
            },
            {
              pattern: new RegExp("(?=.*[!@#$%^&*])"),
              message: "At least one special character",
            },
          ]}
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
