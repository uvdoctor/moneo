import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGLeftProps {
  disable?: boolean;
  className?: string;
}

export default function SVGLeft({ disable, className }: SVGLeftProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 ${disable ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={`${disable ? "#cbd5e0" : COLORS.BLUE}`}
      />
      <path
        fill="white"
        d="M12 10h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5v2a1 1 0 0 1-1.7.7l-4-4a1 1 0 0 1 0-1.4l4-4A1 1 0 0 1 12 8v2z"
      />
    </svg>
  );
}
