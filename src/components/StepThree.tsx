import React, { Fragment } from "react";
import { Alert, Checkbox, Col, Form, Row } from "antd";
import { ROUTES } from "../CONSTANTS";
import { useForm } from "antd/lib/form/Form";
import SelectInput from "./form/selectinput";
import { getRiskProfileOptions, getTaxLiabilityOptions } from "./utils";

interface StepThreeProps {
  riskProfile: string;
  setRiskProfile: Function;
  taxLiability: string;
  setTaxLiability: Function;
  error: string;
  setNotify: Function;
  setDisable: Function;
}

export default function StepThree(props: StepThreeProps) {
  const [form] = useForm();

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
        <Col xs={24} sm={12} md={12} lg={12}>
          <SelectInput
            info="How much Risk are You willing to take in order to achieve higher Investment Return?"
            pre="Can Tolerate"
            unit="Loss"
            value={props.riskProfile}
            changeHandler={props.setRiskProfile}
            options={getRiskProfileOptions()}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <SelectInput
            info="How much do you earn in a year?"
            pre="Yearly Income"
            value={props.taxLiability}
            changeHandler={props.setTaxLiability}
            options={getTaxLiabilityOptions()}
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
