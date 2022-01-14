import { Tooltip } from "antd";
import React, { Fragment, ReactNode } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";

interface LabelWithTooltipProps {
  label: string | ReactNode;
  info?: string;
  inline?: boolean;
}

export default function LabelWithTooltip({
  label,
  info,
  inline,
}: LabelWithTooltipProps) {
  return label ? (
    <Fragment>
      {label}
      {info && (
        <Tooltip title={info}>
          <InfoCircleOutlined />
        </Tooltip>
      )}
      {(label || info) && !inline ? <br /> : null}
    </Fragment>
  ) : null;
}
