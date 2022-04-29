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
  riskProfile: string;
  tax: string;
  dispatch: Function;
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
        <RadioInput
          options={["Send", "Do not send"]}
          value={notify ? "Send" : "Do not send"}
          changeHandler={(value: string) => 
            dispatch({
              type: "single",
              data: { field: "notify", val: value === "Send" ? true : false },
            })
          }
        />
        &nbsp; offers and newsletters
      </Col>
      <Col xs={24} md={12}>
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
      <Col xs={24} md={12}>
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
  );
}
