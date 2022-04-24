import React, { Fragment, useState } from "react";
import { Alert, Checkbox, Col, Form, Row } from "antd";
import { COLORS, ROUTES } from "../CONSTANTS";
import { useForm } from "antd/lib/form/Form";
import TaxLiabilityInput from "./TaxLiabilityInput";
import RiskProfileInput from "./RiskProfileInput";
import TextInput from "./form/textinput";

interface StepThreeProps {
  riskProfile: string;
  setRiskProfile: Function;
  taxLiability: string;
  setTaxLiability: Function;
  error: string;
  setNotify: Function;
  setDisable: Function;
  taxId: string;
  setTaxId: Function;
}

export default function StepThree(props: StepThreeProps) {
  const [form] = useForm();
  const [taxIdError, setTaxIdError] = useState<string>("");

  const handleFormChange = () =>
    props.setDisable(
      form.getFieldError("terms").length > 0 || !form.isFieldTouched("terms")
    );

  return (
    <Fragment>
      <Row>
        <Col span={24}>
          {props.error ? <Alert type="error" message={props.error} /> : null}
        </Col>
      </Row>
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <span>
            <TextInput
              pre="Tax id"
              info="This is your PAN number"
              placeholder="XXXXX1234X"
              value={props.taxId}
              changeHandler={props.setTaxId}
              minLength={10}
              setError={setTaxIdError}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              fieldName="PAN number"
              size="middle"
            />
            {taxIdError ? (
              <label style={{ color: COLORS.RED }}>{taxIdError}</label>
            ) : null}
          </span>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <RiskProfileInput
            value={props.riskProfile}
            changeHandler={props.setRiskProfile}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <TaxLiabilityInput
            value={props.taxLiability}
            changeHandler={props.setTaxLiability}
          />
        </Col>
        <Col span={24}>
          <Form
            name="password"
            form={form}
            onFieldsChange={handleFormChange}
            layout="vertical">
            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_: any, value: any) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Please verify that you agree to the policies"
                          )
                        ),
                },
              ]}>
              <Checkbox defaultChecked={true}>
                I accept the{" "}
                <a target="_blank" href={ROUTES.TC} rel="noreferrer">
                  Terms & Conditions
                </a>
                ,&nbsp;
                <a target="_blank" href={ROUTES.PRIVACY} rel="noreferrer">
                  Privacy Policy
                </a>{" "}
                &nbsp;and&nbsp;
                <a target="_blank" href={ROUTES.SECURITY} rel="noreferrer">
                  Security Policy
                </a>
              </Checkbox>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Checkbox
            defaultChecked={true}
            onChange={(e) =>
              e.target.checked ? props.setNotify(true) : props.setNotify(false)
            }>
            Sign up for emails and text
          </Checkbox>
        </Col>
      </Row>
    </Fragment>
  );
}
