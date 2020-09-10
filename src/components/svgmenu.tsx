import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGMenuProps {
    coverPage?: boolean
}

export default function SVGMenu({coverPage}: SVGMenuProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 cursor-pointer"
    >
      <path
        fill={coverPage ? COLORS.SILVER : COLORS.DEFAULT}
        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
      />
    </svg>
  );
}
