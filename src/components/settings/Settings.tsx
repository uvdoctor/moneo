import React, { Fragment, useState } from "react";
import TextInput from "../form/textinput";
import { Button, Col, Alert, Row } from "antd";

export default function Setting() {
  const [email, setEmail] = useState<string>("mehz1526@gmail.com");
  const [password, setPassword] = useState<string>("mehz@123");
  const [name, setName] = useState<string>("Mehzabeen");
  const [contact, setContact] = useState<string>("8268552015");
  const [error, setError] = useState<string>("");

  return (
    <Fragment>
      {error ? (
        <Fragment>
          <Alert type="error" message={error} />
          <p>&nbsp;</p>
        </Fragment>
      ) : null}
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={12}>
          <h2>Settings</h2>
          <TextInput
            pre="Name"
            placeholder="Your Name"
            value={name}
            changeHandler={setName}
            fieldName="name"
            pattern="^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$"
            setError={setError}
            minLength={3}
          ></TextInput>
          <p>&nbsp;</p>
          <TextInput
            pre="Contact"
            placeholder=""
            value={contact}
            changeHandler={setContact}
            fieldName="contact"
            setError={setError}
            minLength={8}
          ></TextInput>
          <p>&nbsp;</p>
          <TextInput
            pre="Email Id"
            placeholder=""
            value={email}
            changeHandler={setEmail}
            pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
            setError={setError}
            fieldName="Email address"
            minLength={8}
          />
          <p>&nbsp;</p>
          <TextInput
            pre="Password"
            placeholder="XXXXX1234X"
            value={password}
            changeHandler={setPassword}
            fieldName="Password"
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            setError={setError}
            minLength={8}
            maxLength={20}
            password
          ></TextInput>
          <p>&nbsp;</p>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
}
