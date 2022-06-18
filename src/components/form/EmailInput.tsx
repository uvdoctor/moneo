import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import { emailRegex } from "../utils";

interface EmailInputProps {
  setEmail: Function;
  label: string;
  setDisable: Function;
}

export default function EmailInput({
  setEmail,
  label,
  setDisable,
}: EmailInputProps) {
  const [form] = useForm();
  const handleFormChange = () => {
    setDisable(
      form.getFieldError("email").length > 0 ||
        !form.isFieldTouched("email") ||
        form.getFieldValue("email").length === 0
    );
  };

  return (
    <Form
      id="email"
      name="emailChange"
      layout="vertical"
      form={form}
      onFieldsChange={handleFormChange}
    >
      <Form.Item
        name="email"
        label={label}
        rules={[
          {
            pattern: emailRegex,
            message: "This is not a valid email address",
          },
        ]}
        hasFeedback
      >
        <Input onChange={(e) => setEmail(e.currentTarget.value)} />
      </Form.Item>
    </Form>
  );
}
