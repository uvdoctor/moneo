import { Button, Col, Form, Input, Radio, Row, Skeleton } from "antd";
import React, { Fragment, useContext, useEffect, useRef } from "react";
import Content from "../Content";
import { FeedbackType } from "../../api/goals";
import { FormInstance } from "antd/lib/form";
import { FeedbackContext } from "./FeedbackContext";
import TextArea from "antd/lib/input/TextArea";
import { AppContext } from "../AppContext";
require("./Feedback.less");

interface FeedbackProps {
  rating?: number;
}

export default function Feedback({ rating }: FeedbackProps) {
  const { user, appContextLoaded }: any = useContext(AppContext);
  const { isLoading, onFormSubmit, form, setRating }: any = useContext(FeedbackContext);
  const formRef = useRef<FormInstance>(null);

  const isValidFeedback = () => {
    if(!formRef.current?.getFieldValue("feedback")) return false;
    if(!user && (!formRef.current?.getFieldValue("firstName") || !formRef.current?.getFieldValue("email"))) return false;
    return true;
  };

  useEffect(() => {
    if(rating) {
      setRating(rating)
    }
  }, [])

  return (
    <Content className="feedback">
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={12}>
          <Form
            form={form}
            ref={formRef}
            name="submit"
            layout="vertical"
            initialValues={{
              "feedbackType": FeedbackType.C,
            }}
            onFinish={onFormSubmit}
          >
            <Form.Item name="feedbackType">
              <Radio.Group>
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
            {appContextLoaded ? 
            !user && <Fragment>
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
                    message: "Please enter valid first name",
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
                    message: "Please enter valid last name",
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
                    pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Please enter valid email address",
                  },
                ]}
              >
              <Input placeholder="Enter email address" />
              </Form.Item>
            </Fragment> : 
            <Skeleton active />}
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    form
                      .getFieldsError()
                      .filter(({ errors }: any) => errors.length).length > 0 ||
                      !isValidFeedback()
                  }
                  loading={isLoading || !appContextLoaded}
                >
                  Submit
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}
