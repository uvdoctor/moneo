import { Button, Form, Input, Radio, Divider } from "antd";
import React, { useContext, useEffect, useRef } from "react";
import Content from "../Content";
import { FeedbackType } from "../../api/goals";
import { FormInstance } from "antd/lib/form";
import { FeedbackContext } from "./FeedbackContext";
import TextArea from "antd/lib/input/TextArea";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { validateCaptcha } from "../utils";

export default function Feedback() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    feedbackType,
    feedback,
    firstName,
    lastName,
    email,
    isLoading,
    onFormSubmit,
    form,
  }: any = useContext(FeedbackContext);

  const formRef = useRef<FormInstance>(null);

  useEffect(() => {
    let isBot = checkIfBot();
    console.log("isBot", isBot);
    if (formRef.current) {
      formRef.current.setFieldsValue({
        feedbackType,
        feedback,
        firstName,
        lastName,
        email,
      });
    }
  }, [feedbackType, feedback, firstName, lastName, email]);

  const checkIfBot = async () => {
    return await validateCaptcha("feedback", executeRecaptcha);
  };

  return (
    <Content className="about">
      <h2>Contact US</h2>
      <Divider />
      <Form
        form={form}
        ref={formRef}
        name="submit"
        layout="vertical"
        initialValues={{
          ["feedbackType"]: FeedbackType.C,
        }}
        onFinish={onFormSubmit}
        size="large"
      >
        <Form.Item name="feedbackType">
          <Radio.Group value={feedbackType}>
            <Radio.Button value={FeedbackType.C}>Comment</Radio.Button>
            <Radio.Button value={FeedbackType.S}>Suggestion</Radio.Button>
            <Radio.Button value={FeedbackType.Q}>Question</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="feedback"
          label="Describe Your Feedback"
          rules={[
            {
              required: true,
              min: 10,
              type: "string",
              message: "Please enter valid feedback (min 10 characters)",
            },
          ]}
        >
          <TextArea rows={6} placeholder="Enter feedback" />
        </Form.Item>
        <Form.Item
          name="firstName"
          label="First Name"
          style={{
            display: "inline-block",
            width: "calc(50% - 12px)",
            marginRight: 10,
          }}
          rules={[
            {
              required: true,
              type: "string",
              message: "Please enter valid first name!",
            },
          ]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          style={{
            display: "inline-block",
            width: "calc(50% - 12px)",
          }}
          rules={[
            {
              required: false,
              type: "string",
              message: "Please enter valid last name!",
            },
          ]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter valid email address!",
            },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                form.getFieldsError().filter(({ errors }: any) => errors.length)
                  .length > 0 ||
                !formRef.current?.getFieldValue("feedback") ||
                !formRef.current?.getFieldValue("firstName") ||
                !formRef.current?.getFieldValue("email")
              }
              loading={isLoading}
            >
              Submit
            </Button>
          )}
        </Form.Item>
      </Form>
    </Content>
  );
}
