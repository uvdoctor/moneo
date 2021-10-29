import { Button, Form, Input, notification } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Auth } from "aws-amplify";
import React, { useContext, useState } from "react";
import { FormInstance } from "antd/lib/form";
import { AppContext } from "../AppContext";

interface PasswordInputProps {
  user: any;
}

export default function PasswordInput(user : PasswordInputProps) {
  const { validateCaptcha }: any = useContext(AppContext);
  const [disabledForm, setDisabledForm] = useState<boolean>(true);
  const [form] = useForm();
  const inputEl = React.createRef<FormInstance>();

  const updatePassword = async () => {
    const value = (name: string) => inputEl.current?.getFieldValue(name);
    Auth.changePassword(user, value("oldpass"), value("pass"))
      .then(() => {
        notification.success({ message: "Password Updated" });
      })
      .catch((err) => {
        notification.error({ message: "Wrong Credentials " + err.message });
      });
  };

  const handleFormChange = () =>
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );

  return (
    <Form
      name="password"
      layout="horizontal"
      size="large"
      form={form}
      onFieldsChange={handleFormChange}
      ref={inputEl}
    >
      <Form.Item
        name="oldpass"
        rules={[{ required: true, message: "Please input your password!" }]}
        hasFeedback
      >
        <Input.Password addonBefore={'Old Password'} allowClear />
      </Form.Item>
      <Form.Item
        name="pass"
        required={true}
        dependencies={["oldpass"]}
        hasFeedback
        rules={[
          {
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
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("oldpass") === value) {
                return Promise.reject(
                  new Error("Current password should not be same as old one")
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password addonBefore={'New Password'} allowClear />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={disabledForm}
          onClick={() => {
            validateCaptcha("password_change").then((success: boolean) => {
              if (!success) return;
              updatePassword();
            });
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
