import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGLoanProps {
  disabled: boolean;
  selected: boolean;
}

export default function SVGLoan({ disabled, selected }: SVGLoanProps) {
  return (
    <svg
      className="w-8"
      viewBox="0 0 490 490"
    >
      <g id="flat">
        <path 
          d="m376 127.622c50.33 48.128 112 126.84 112 184.378 0 97.2-78.8 152-176 152s-176-54.8-176-152c0-57.388 61.348-135.88 111.6-184z"
          fill={disabled ? COLORS.LIGHT_GRAY : selected ? COLORS.GREEN : COLORS.DISABLED}
        />
        <path 
          d="m463.907 237.588c-32.34 93.366-121.038 160.412-225.407 160.412a237.9 237.9 0 0 1 -86.031-16c28.037 53.08 88.923 82 159.531 82 97.2 0 176-54.8 176-152 0-22.585-9.5-48.433-24.093-74.412z"
          fill={disabled ? COLORS.LIGHT_GRAY : selected ? COLORS.GREEN : COLORS.DISABLED}
        />
        <path 
          d="m247.605 128 128.4-.38 21.384-64.249c6.27-18.838-14.4-35.2-31.164-24.675a21.008 21.008 0 0 1 -26.078-2.984 39.666 39.666 0 0 0 -56.284 0 21.008 21.008 0 0 1 -26.083 2.988l-.3-.192c-16.735-10.508-37.38 5.77-31.194 24.592z"
          fill={disabled ? COLORS.LIGHT_GRAY : selected ? COLORS.GREEN : COLORS.DISABLED}
        />
        <rect fill={disabled ? COLORS.LIGHT_GRAY : selected ? "#8c6239" : COLORS.LIGHT_GRAY} height="32" rx="16" width="176" x="224" y="88" />
        <rect fill={disabled ? COLORS.LIGHT_GRAY : selected ? "#603813" : COLORS.DISABLED} height="32" rx="16" width="176" x="224" y="120" />
        <path d="m232 264v-32l80-24 80 24v32z" fill={disabled ? COLORS.DEFAULT : selected ? "gray" : COLORS.DEFAULT} />
        <g fill={disabled ? COLORS.DEFAULT : selected ? "white" : COLORS.DEFAULT}>
          <path d="m232 272h16v80h-16z" />
          <path d="m280 272h16v80h-16z" />
          <path d="m376 272h16v80h-16z" />
          <path d="m328 272h16v80h-16z" />
        </g>
        <path d="m216 256h192v32h-192z" fill={disabled ? COLORS.DEFAULT : selected ? COLORS.ORANGE : COLORS.DEFAULT} />
        <path d="m216 336h192v32h-192z" fill={disabled ? COLORS.DEFAULT : selected ? COLORS.ORANGE : COLORS.DEFAULT} />
        <path
          d="m354.367 368h53.633v-32h-9.112a239.2 239.2 0 0 1 -44.521 32z"
          fill={disabled ? COLORS.DEFAULT : selected ? COLORS.ORANGE : COLORS.DEFAULT}
        />
      </g>
    </svg>
  );
}
