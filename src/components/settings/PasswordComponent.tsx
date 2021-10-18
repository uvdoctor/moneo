import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import PasswordInput from "../form/PasswordInput";

interface PasswordComponentProps {
  oldPass: any;
  pass: any;
  setDisabledForm: any;
}

export default function PasswordComponent({
  oldPass,
  pass,
  setDisabledForm,
}: PasswordComponentProps) {
  const [form] = useForm();
  const [isEnable, setIsEnable] = useState<boolean>(true);

  const handleFormChange = () => {
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );

    setIsEnable(
      form.getFieldError("pass").some((e) => e.length) ||
        !form.isFieldTouched("pass") ||
        !form.getFieldValue("pass")
    );

    oldPass.current = form.getFieldValue("oldpass");
    pass.current = form.getFieldValue("pass");
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
      <PasswordInput pass={pass} setDisabledForm={handleFormChange} />
      <Form.Item
        name="repass"
        label="Re-enter Password"
        dependencies={["pass"]}
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue("pass") === value) return Promise.resolve();
              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password allowClear disabled={isEnable} />
      </Form.Item>
    </Form>
  );
}
