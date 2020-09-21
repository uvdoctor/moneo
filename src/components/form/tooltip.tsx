import React from "react";
import ReactTooltip from "react-tooltip";
import SVGInfo from "../svginfo";

interface TooltipProps {
  info: string;
  error?: boolean
  text?: string
  color?: string
}

export default function Tooltip({ info, error, text, color }: TooltipProps) {
  return (
    <div className="w-full flex justify-end">
      <ReactTooltip type={error ? "error" : "info"} place={error ? "right" : "top"} />
      {text && <label className="text-base" style={{ color: color }}>
        {text}
      </label>}
      {info && (
        <a data-tip={info}>
          <SVGInfo />
        </a>
      )}
    </div>
  );
}
