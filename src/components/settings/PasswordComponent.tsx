import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";

interface PasswordComponentProps {
  oldPass: any;
  newPass: any;
  setDisabledForm: any;
}

export default function PasswordComponent({
  oldPass,
  newPass,
  setDisabledForm,
}: PasswordComponentProps) {
  const [form] = useForm();

  const handleFormChange = () => {
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );
    oldPass.current = form.getFieldValue("oldpass");
    newPass.current = form.getFieldValue("newpass");
  };

  return (
    <Form
      name="password"
      layout="vertical"
      form={form}
      onFieldsChange={handleFormChange}
    >
      <Form.Item name="oldpass" label="Old Password" required={true}>
        <Input.Password allowClear />
      </Form.Item>
      <Form.Item
        name="newpass"
        label="New Password"
        required={true}
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
              if (getFieldValue("oldpass") !== value) return Promise.resolve();
              return Promise.reject("Old and New password should not be same");
            },
          }),
        ]}
      >
        <Input.Password allowClear />
      </Form.Item>
      <Form.Item
        name="repass"
        label="Re-enter Password"
        dependencies={["newpass"]}
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue("newpass") === value) return Promise.resolve();
              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password allowClear />
      </Form.Item>
    </Form>
  );
}
