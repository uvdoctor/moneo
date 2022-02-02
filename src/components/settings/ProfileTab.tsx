import { Col, Row } from "antd";
import React, { useContext } from "react";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import RadioInput from "../form/RadioInput";
import { AppContext } from "../AppContext";
import TaxLiabilityInput from "../TaxLiabilityInput";
import RiskProfileInput from "../RiskProfileInput";

interface ProfileTabProps {
  isDrManual: boolean;
  notify: boolean;
  dispatch: Function;
  riskProfile: string;
  tax: string;
}

export default function ProfileTab({
  isDrManual,
  notify,
  riskProfile,
  tax,
  dispatch,
}: ProfileTabProps) {
  const { discountRate, setDiscountRate }: any = useContext(AppContext);

  return (
    <Row
      gutter={[
        { xs: 0, sm: 0, md: 35 },
        { xs: 15, sm: 15, md: 15 },
      ]}>
      <Col xs={24} md={12}>
        <NumberInput
          unit="%"
          pre="Discount Rate"
          value={discountRate}
          changeHandler={setDiscountRate}
          disabled={!isDrManual}
          addBefore={
            <SelectInput
              pre=""
              value={isDrManual ? "manual" : "auto"}
              options={{ manual: "Manual", auto: "Auto" }}
              changeHandler={(value: string) =>
                dispatch({
                  type: "single",
                  data: {
                    field: "isDrManual",
                    val: value === "manual",
                  },
                })
              }
            />
          }
        />
      </Col>
      <Col xs={24} md={12}>
        <Row>
          <Col xs={24}>Subscribe to offers and newsletters</Col>
          <Col>
            <RadioInput
              options={["Yes", "No"]}
              value={notify ? "Yes" : "No"}
              changeHandler={(value: string) =>
                dispatch({
                  type: "single",
                  data: { field: "notify", val: value === "Yes" },
                })
              }
            />
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={12}>
        <Row>
          <Col>
            <RiskProfileInput
              value={riskProfile}
              changeHandler={(val: string) =>
                dispatch({
                  type: "single",
                  data: { field: "riskProfile", val },
                })
              }
            />
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={12}>
        <Row>
          <Col>
            <TaxLiabilityInput
              value={tax}
              changeHandler={(val: string) =>
                dispatch({
                  type: "single",
                  data: { field: "tax", val },
                })
              }
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
