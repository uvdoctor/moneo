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
  monthlyExp: number;
  monthlyInv: number;
  dispatch: Function;
}

export default function ProfileTab({
  isDrManual,
  notify,
  riskProfile,
  tax,
  monthlyExp,
  monthlyInv,
  dispatch,
}: ProfileTabProps) {
  const { discountRate, setDiscountRate, defaultCurrency }: any =
    useContext(AppContext);

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
          value={notify ? "Yes" : "No"}
          changeHandler={(value: string) =>
            dispatch({
              type: "single",
              data: { field: "notify", val: value === "Yes" },
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
      <Col xs={24} md={12}>
        <NumberInput
          pre="Average monthly investment"
          value={monthlyInv}
          changeHandler={(val: number) =>
            dispatch({
              type: "single",
              data: { field: "monthlyInv", val },
            })
          }
          currency={defaultCurrency}
          min={100}
          max={1000000}
          noRangeFactor
        />
      </Col>
      <Col xs={24} md={12}>
        <NumberInput
          pre="Average monthly expense"
          value={monthlyExp}
          min={100}
          max={1000000}
          noRangeFactor
          changeHandler={(val: number) =>
            dispatch({
              type: "single",
              data: { field: "monthlyExp", val },
            })
          }
          currency={defaultCurrency}
        />
      </Col>
    </Row>
  );
}
