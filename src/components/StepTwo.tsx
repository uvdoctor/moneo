import React, { Fragment, useEffect, useState } from "react";
import { Alert, Checkbox, Col, Form, Row } from "antd";
import { ROUTES } from "../CONSTANTS";
import { useForm } from "antd/lib/form/Form";
import TaxLiabilityInput from "./TaxLiabilityInput";
import RiskProfileInput from "./RiskProfileInput";
import DateInput from "./form/DateInput";
import { getStr } from "./utils";

interface StepTwoProps {
  setDOB: Function;
  riskProfile: string;
  setRiskProfile: Function;
  taxLiability: string;
  setTaxLiability: Function;
  error: string;
  setNotify: Function;
  setDisable: Function;
}

export default function StepTwo(props: StepTwoProps) {
  const [form] = useForm();
  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2000);

  useEffect(() => {
    props.setDOB(`${year}-${getStr(month)}-${getStr(date)}`);
  }, [date, month, year]);

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
          <DateInput
            title={"Date of Birth"}
            startYearHandler={setYear}
            startDateHandler={setDate}
            startMonthHandler={setMonth}
            startYearValue={year}
            startMonthValue={month}
            startDateValue={date}
            size="middle"
          />
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
            layout="vertical"
          >
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
              ]}
            >
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
            }
          >
            Sign up for emails and text
          </Checkbox>
        </Col>
      </Row>
    </Fragment>
  );
}
