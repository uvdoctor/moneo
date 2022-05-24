import React, { Fragment, useState } from "react";
import { Form, Input } from "antd";
import { Translations } from "@aws-amplify/ui-components";
import { useForm } from "antd/lib/form/Form";

interface PasswordInputProps {
  setPassword: Function;
  setPasswordError: Function;
  setError?: Function;
}

export default function PasswordInput({
  setPassword,
  setPasswordError,
  setError,
}: PasswordInputProps) {
  const [form] = useForm();
  const [help, setHelp] = useState<Array<string>>([]);
  const [formError, setFormError] = useState<Array<string>>([]);

  const handleFormChange = () => {
    setError && setError("");
    form.getFieldValue("password").length > 0
      ? setHelp([
          ...[
            "Password must be between 8-20 characters",
            "At least one lowercase",
            "At least one uppercase",
            "At least one digit",
            "At least one special character",
          ],
        ])
      : setHelp([...[]]);
    setFormError([...form.getFieldError("password")]);
    setPasswordError(
      form.getFieldError("password").length > 0 ||
        !form.isFieldTouched("password") ||
        form.getFieldValue("password").length === 0
    );
  };

  return (
    <Fragment>
      <Form
        name="form"
        form={form}
        layout="vertical"
        onFieldsChange={handleFormChange}
      >
        <Form.Item
          name="password"
          help={help.map((item) => (
            <text key={item} style={{ color: formError?.includes(item) ? 'red': 'green' }}>
              {item}
              <br />
            </text>
          ))}
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
