import { Col, Form, Input, notification, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Auth } from "aws-amplify";
import React, { useContext, useState } from "react";
import { FormInstance } from "antd/lib/form";
import SaveButton from "./SaveButton";
import { AppContext } from "../AppContext";

export default function PasswordTab() {
  const { user, validateCaptcha }: any = useContext(AppContext);
  const [disabledForm, setDisabledForm] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const inputEl = React.createRef<FormInstance>();

  const updatePassword = async () => {
    setLoading(true);
    const value = (name: string) => inputEl.current?.getFieldValue(name);
    const success = await validateCaptcha("password_settings");
    if (!success) return;
    Auth.changePassword(user, value("oldpass"), value("pass"))
      .then(() => {
        notification.success({ message: "Password Updated" });
      })
      .catch((err) => {
        notification.error({ message: "Wrong Credentials " + err.message });
      });
    setLoading(false);
  };

  const handleFormChange = () =>
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );

  return (
    <Row justify="start">
      <Col>
        <Form
          name="password"
          layout="vertical"
          size="large"
          form={form}
          onFieldsChange={handleFormChange}
          ref={inputEl}
        >
          <Form.Item
            name="oldpass"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Row gutter={[0, 5]}>
              <Col span={24}>Old Password</Col>
              <Col xs={24} sm={24}>
                <Input.Password allowClear placeholder="Old Password" />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="pass"
            required={true}
            dependencies={["oldpass"]}
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
                      new Error(
                        "Current password should not be same as old one"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Row gutter={[0, 5]}>
              <Col span={24}>New Password</Col>
              <Col xs={24} sm={24}>
                <Input.Password allowClear placeholder="New Password" />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Row justify="center">
              <Col xs={24} sm={24} md={16}>
                <SaveButton
                  disabledForm={disabledForm}
                  onClick={updatePassword}
                  loading={loading}
                />
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
