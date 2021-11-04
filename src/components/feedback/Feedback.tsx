import { Button, Col, Form, Input, Radio, Row, Skeleton } from "antd";
import React, { Fragment, useContext, useEffect, useRef } from "react";
import Content from "../Content";
import { FeedbackType } from "../../api/goals";
import { FormInstance } from "antd/lib/form";
import { FeedbackContext } from "./FeedbackContext";
import TextArea from "antd/lib/input/TextArea";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faMobile,
  faEnvelope,
  faTools,
} from "@fortawesome/free-solid-svg-icons";*/

require("./Feedback.less");
import { AppContext } from "../AppContext";

export default function Feedback() {
  const { validateCaptcha, user, appContextLoaded }: any = useContext(AppContext);
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

  const isValidFeedback = () => {
    if(!formRef.current?.getFieldValue("feedback")) return false;
    if(!user && (!formRef.current?.getFieldValue("firstName") || !formRef.current?.getFieldValue("email"))) return false;
    return true;
  };

  useEffect(() => {
    validateCaptcha("feedback").then((isBot: boolean) => {
      console.log("isBot", isBot);
      if(isBot) return;
      if (formRef.current) {
        formRef.current.setFieldsValue({
          feedbackType,
          feedback,
          firstName,
          lastName,
          email,
        });
      }
    });
  }, [feedbackType, feedback, firstName, lastName, email]);

  return (
    <Content className="feedback">
      <Row justify="center">
      {/*<h2>Contact US</h2>
      <Divider />
      <Row
        gutter={[
          { xs: 0, sm: 0, md: 30, lg: 30 },
          { xs: 0, sm: 0, md: 30, lg: 30 },
        ]}
      >
        <Col xs={24} sm={24} md={24} lg={12}>
          <p>
            If you have any quires or have any project fill free to contact us.
            Our support team is available for you 24/7.
          </p>
          <Row
            className="support-types"
            gutter={[
              { xs: 0, sm: 0, md: 20, lg: 20 },
              { xs: 0, sm: 0, md: 20, lg: 20 },
            ]}
          >
            <Col className="support-type" xs={24} sm={12}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="3x" />
              <div>
                <strong>Our Location</strong>
                <div>
                  <p>907 N Randolph street, Denvar, United States</p>
                </div>
              </div>
            </Col>
            <Col className="support-type" xs={24} sm={12}>
              <FontAwesomeIcon icon={faMobile} size="3x" />
              <div>
                <strong>Our Phone</strong>
                <div>
                  <p>+123 625 254 965</p>
                  <p> +854 526 481 856</p>
                </div>
              </div>
            </Col>
            <Col className="support-type" xs={24} sm={12}>
              <FontAwesomeIcon icon={faEnvelope} size="3x" />
              <div>
                <strong>Our E-mail</strong>
                <div>
                  <p>demo@gmail.com</p>
                  <p> esample@gmail.com</p>
                </div>
              </div>
            </Col>
            <Col className="support-type" xs={24} sm={12}>
              <FontAwesomeIcon icon={faTools} size="3x" />
              <div>
                <strong>Our Support</strong>
                <div>
                  <p>support@gmail.com</p>
                  <p> example@gmail.com</p>
                </div>
              </div>
            </Col>
          </Row>
          </Col>*/}
        <Col xs={24} sm={24} md={24} lg={12}>
          <Form
            form={form}
            ref={formRef}
            name="submit"
            layout="vertical"
            initialValues={{
              ["feedbackType"]: FeedbackType.C,
            }}
            onFinish={onFormSubmit}
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
