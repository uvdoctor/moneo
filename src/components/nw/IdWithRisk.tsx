import { Badge, Tooltip } from "antd";
import React from "react";
import { RiskProfile } from "../../api/goals";
import { COLORS } from "../../CONSTANTS";
import { getRiskAttributesByProfile } from "./nwutils";

interface IdWithRiskProps {
  id: string;
  risk: RiskProfile | null;
}

export default function IdWithRisk({ id, risk }: IdWithRiskProps) {
  return (
    <Tooltip
      title={
        risk
          ? `This holding may lead to ${getRiskAttributesByProfile(risk).label}`
          : ""
      }>
      <Badge
        count={id}
        style={{
          color: COLORS.WHITE,
          backgroundColor: risk
            ? getRiskAttributesByProfile(risk).color
            : COLORS.DEFAULT,
        }}
      />
    </Tooltip>
  );
}
