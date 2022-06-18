import { Col, Row } from "antd";
import React, { useContext } from "react";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import RadioInput from "../form/RadioInput";
import { AppContext } from "../AppContext";
import TaxLiabilityInput from "../TaxLiabilityInput";
import RiskProfileInput from "../RiskProfileInput";
import { UserSettingsContext } from "./UserSettingsContext";

export default function ProfileTab() {
  const {
    isDrManual,
    notify,
    riskProfile,
    tax,
    setIsDrManual,
    setNotify,
    setRiskProfile,
    setTax,
  }: any = useContext(UserSettingsContext);
  const { discountRate, setDiscountRate }: any = useContext(AppContext);

  return (
    <Row
      gutter={[
        { xs: 0, sm: 0, md: 35 },
        { xs: 15, sm: 15, md: 15 },
      ]}
    >
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
              changeHandler={(val: any) => setIsDrManual(val === "manual")}
            />
          }
        />
      </Col>
      <Col xs={24} md={12}>
        <RadioInput
          options={["Send", "Do not send"]}
          value={notify ? "Send" : "Do not send"}
          changeHandler={(value: string) =>
            setNotify(value === "Send" ? true : false)
          }
        />
        &nbsp; offers and newsletters
      </Col>
      <Col xs={24} md={12}>
        <RiskProfileInput
          value={riskProfile}
          changeHandler={(val: string) => setRiskProfile(val)}
        />
      </Col>
      <Col xs={24} md={12}>
        <TaxLiabilityInput
          value={tax}
          changeHandler={(val: string) => setTax(val)}
        />
      </Col>
    </Row>
  );
}
