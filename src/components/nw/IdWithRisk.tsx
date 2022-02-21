import { Badge, Tooltip } from "antd";
import React, { useContext } from "react";
import { RiskProfile } from "../../api/goals";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import { doesExceedRisk, getRiskAttributesByProfile } from "./nwutils";

interface IdWithRiskProps {
  id: string;
  risk: RiskProfile | null;
}

export default function IdWithRisk({ id, risk }: IdWithRiskProps) {
  const { userInfo }: any = useContext(AppContext);
  return (
    <Tooltip
      title={
        risk
          ? `This holding may lead to ${
              getRiskAttributesByProfile(risk).label
            }${
              doesExceedRisk(risk, userInfo.rp)
                ? `, which exceeds your acceptable risk level - ${
                    getRiskAttributesByProfile(userInfo.rp).label
                  }`
                : ""
            }`
          : ""
      }>
      <Badge
        count={id}
        overflowCount={100000000}
        style={{
          color: COLORS.WHITE,
          backgroundColor: risk
            ? getRiskAttributesByProfile(risk).color
            : COLORS.DEFAULT,
        }}
      />
      {risk && doesExceedRisk(risk, userInfo.rp) ? <>&nbsp;&#128681;</> : null}
    </Tooltip>
  );
}
