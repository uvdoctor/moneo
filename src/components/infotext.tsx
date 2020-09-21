import React from "react";
import { COLORS } from "../CONSTANTS";
import Tooltip from "./form/tooltip";

interface InfoTextProps {
  text: string;
  color: string;
  info: string;
}

export default function InfoText({ text, color, info }: InfoTextProps) {
  return (
    <div className="w-full flex items-start">
      <label className="text-base" style={{ color: color }}>
        {text}
      </label>
      <Tooltip info={info} error={color === COLORS.RED} />
    </div>
  );
}
