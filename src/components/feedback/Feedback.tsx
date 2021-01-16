import { Button, Form, Input, Modal, Radio } from "antd";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { FeedbackType } from "../../api/goals";
import { FormInstance } from "antd/lib/form";
import { FeedbackContext } from "./FeedbackContext";
import TextArea from "antd/lib/input/TextArea";

export default function Feedback() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    feedbackType,
    feedback,
    firstName,
    lastName,
    email,
    isLoading,
    onFormSubmit,
    setFeedbackType,
    setFeedback,
    setFirstName,
    setLastName,
    setEmail
  }: any = useContext(FeedbackContext);

  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(null);
  
  const openModal = () => setModalVisible(true);

  const closeModal = () => {
    setModalVisible(false);
    setFeedbackType(FeedbackType.C);
    setFeedback("");
    setFirstName("");
    setLastName("");
    setEmail("");
  };

  useEffect(() => {
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
    <Fragment>
      <span style={{ cursor: "pointer" }} onClick={openModal}>
        <FontAwesomeIcon icon={faPenSquare} />
      </span>
      {modalVisible && (
        <Modal
          centered
          title={
            <div style={{ cursor: "move" }}>Please provide your feedback</div>
          }
          footer={null}
          onCancel={closeModal}
          destroyOnClose
          visible={modalVisible}
        >
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
                    form.getFieldsError().filter(({ errors }) => errors.length)
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
        </Modal>
      )}
    </Fragment>
  );
}
