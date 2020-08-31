import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGBarChartProps {
  disabled: boolean;
  selected: boolean;
}
export default function SVGBarChart({ disabled, selected }: SVGBarChartProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-8">
      <path
        fill={COLORS.LIGHT_GRAY}
        stroke={
          disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT
        }
        d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm11 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z"
      />
      <path
        fill={
          disabled ? COLORS.DISABLED : selected ? "#4CAF50" : COLORS.DEFAULT
        }
        d="M8 11a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zm4-2a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z"
      />
    </svg>
  );
}
