import { Button, Form, Input, Radio, Row } from "antd";
import React, {
  useContext,
  useEffect,
  useRef,
} from "react";
import { FeedbackType } from "../../api/goals";
import { FormInstance } from "antd/lib/form";
import { FeedbackContext } from "./FeedbackContext";
import TextArea from "antd/lib/input/TextArea";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Feedback() {

  const { executeRecaptcha } = useGoogleReCaptcha();
   
  const executeCaptcha = async () => {
    const token = await executeRecaptcha("feedback");

    console.log("Captcha token = ", token);
    fetch('/api/verifycaptcha', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				token: token
			})
		}).then((captchRes: any) => {
			console.log("Captcha Response: ", captchRes);
		});
  }

  const {
    feedbackType,
    feedback,
    firstName,
    lastName,
    email,
    isLoading,
    onFormSubmit,
    form
  }: any = useContext(FeedbackContext);

  const formRef = useRef<FormInstance>(null);
  
  useEffect(() => {
    executeCaptcha();
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

  return (
    <Row justify="center"> 
          <Form 
            form={form}
            ref={formRef}
            name="submit"
            layout="vertical"
            initialValues={{
              ["feedbackType"]: FeedbackType.C,
            }}
            onFinish={onFormSubmit}>
            <Form.Item name="feedbackType">
                <Radio.Group value={feedbackType}>
                  <Radio value={FeedbackType.C}>Comment</Radio>
                  <Radio value={FeedbackType.S}>Suggestion</Radio>
                  <Radio value={FeedbackType.Q}>Question</Radio>
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
              <TextArea placeholder="Enter feedback" />
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
                    form.getFieldsError().filter(({ errors } : any) => errors.length)
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
          </Row>
  );
}
