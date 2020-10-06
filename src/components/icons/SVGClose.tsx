import React from "react";
import { COLORS } from "../CONSTANTS";

export default function SVGClose() {
  return (
    <svg viewBox="0 0 24 24">
      <circle
        fill="none"
        stroke={`${
          disable ? COLORS.DISABLED : coverPage ? COLORS.SILVER : COLORS.DEFAULT
        }`}
        cx="12"
        cy="12"
        r="10"
      />
      <path
        fill={coverPage ? COLORS.SILVER : COLORS.DEFAULT}
        d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"
      />
    </svg>
  );
}
