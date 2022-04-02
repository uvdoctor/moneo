import { Col, Row } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import React, { useEffect, useState } from "react";
import TextInput from "./textinput";

interface EmailInputProps {
  label?: string;
  changeHandler: Function;
  value: string;
  post?: any;
  style?: any;
  emailError?: string;
  setDisable?: Function;
  size?: SizeType;
}

export default function EmailInput({ 
  changeHandler,
  value,
  post,
  style,
  emailError,
  setDisable,
  size,
  label,
}: EmailInputProps) {
  const [error, setError] = useState<any>("");
  useEffect(() => {
    setDisable && setDisable(error ? true : false);
  }, [error]);

  return (
    <Row>
      <Col span={24}>
        <TextInput
          size={size ? size : "middle"}
          pre={label ? label : "Email"}
          value={value}
          changeHandler={(val: any) => changeHandler(val)}
          style={style}
          fieldName={"Email"}
          placeholder="abc@xyz.com"
          pattern={new RegExp(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					)}
          setError={(val: any) => setError(val)}
          post={post}
        />
      </Col>
      <Col>
        {error ? <label style={{ color: "red" }}>{error}</label> : null}
        {emailError ? (
          <label style={{ color: "red" }}>{emailError}</label>
        ) : null}
      </Col>
    </Row>
  );
}
