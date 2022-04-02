import { Col, Row } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import TextInput from "./textinput";

interface MobileInputProps {
  changeHandler: Function;
  value: string;
  post?: any;
  style?: any;
  label: string;
  phoneError?: string;
  setDisable?: Function;
  size?: SizeType;
  fieldName?: string
}

export default function MobileInput({
  changeHandler,
  value,
  post,
  style,
  label,
  phoneError,
  setDisable,
  size,
  fieldName
}: MobileInputProps) {
  const { countrycode }: any = useContext(AppContext);
  const [error, setError] = useState<any>("");

  useEffect(()=>{
    setDisable && setDisable(error ? true: false)
  },[error, value])

  return (
    <Row>
      <Col span={24}>
        <TextInput
          size={size ? size : "middle"}
          pre={label}
          prefix={countrycode()}
          value={value}
          changeHandler={(val: any) => changeHandler(val)}
          style={style}
          fieldName={ fieldName ? fieldName : "Phone number"}
          pattern="^[0-9]"
          setError={(val: any) => setError(val)}
          minLength={10}
          maxLength={10}
          post={post}
        />
      </Col>
      <Col>
        {error ? <label style={{ color: "red" }}>{error}</label> : null}
        {phoneError ? <label style={{ color: "red" }}>{phoneError}</label> : null}
      </Col>
    </Row>
  );
}
