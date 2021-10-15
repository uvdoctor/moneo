import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";

interface PasswordInputProps {
  pass: any;
  setDisabledForm: any;
}

export default function PasswordInput({
  pass,
  setDisabledForm,
}: PasswordInputProps) {
  const [form] = useForm();

  const handleFormChange = () => {
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );
    pass.current = form.getFieldValue("pass");
  };

  return (
    <Form.Item
      name="pass"
      label="Password"
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
      ]}
      hasFeedback
    >
      <Input.Password allowClear onChange={handleFormChange} />
    </Form.Item>
  );
}
