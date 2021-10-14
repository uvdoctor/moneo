import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";

interface NameComponentProps {
  name: any;
  middleName: any;
  lastName: any;
  user: any;
  setDisabledForm: any;
}

export default function NameComponent({
  name,
  middleName,
  lastName,
  user,
  setDisabledForm,
}: NameComponentProps) {
  const [form] = useForm();
  const nameRules = () => [
    {
      pattern: new RegExp("^[a-zA-Z'-.,]+$"),
      message: "Invalid Format",
    },
    {
      min: 2,
      max: 20,
      message: "Length 2-20",
    },
  ];

  const handleFormChange = () => {
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.getFieldValue("name")
    );
    name.current = form.getFieldValue("name");
    middleName.current = form.getFieldValue("middlename");
    lastName.current = form.getFieldValue("lastname");
  };

  return (
    <Form
      name="namechange"
      layout="vertical"
      form={form}
      onFieldsChange={handleFormChange}
    >
      <Form.Item
        name="name"
        label="Name"
        required={true}
        initialValue={user?.attributes.name}
        rules={nameRules()}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="middlename"
        label="Middle Name"
        initialValue={user?.attributes.middle_name}
        rules={nameRules()}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastname"
        label="Last Name"
        rules={nameRules()}
        initialValue={user?.attributes.family_name}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
