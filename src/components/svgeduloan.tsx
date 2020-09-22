import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGEduLoanProps {
  disabled?: boolean;
}

export default function SVGEduLoan({ disabled }: SVGEduLoanProps) {
  return (
    <svg className="w-8" viewBox="0 0 512 512">
      <linearGradient
        id="New_Gradient_Swatch_5"
        gradientUnits="userSpaceOnUse"
        x1="131.122"
        x2="380.878"
        y1="436.878"
        y2="187.122"
      >
        <stop offset=".011" stop-color={disabled ? COLORS.LIGHT_GRAY : COLORS.GREEN} />
        <stop offset="1" stop-color={disabled ? COLORS.LIGHT_GRAY : COLORS.LIGHT_GREEN} />
      </linearGradient>
      <linearGradient
        id="New_Gradient_Swatch_3"
        gradientUnits="userSpaceOnUse"
        x1="169"
        x2="345"
        y1="149"
        y2="-27"
      >
        <stop offset=".011" stop-color={disabled ? "white" : "#606082"} />
        <stop offset="1" stop-color={disabled ? "white" : "#83839e"} />
      </linearGradient>
      <linearGradient
        id="New_Gradient_Swatch_18"
        gradientUnits="userSpaceOnUse"
        x1="180"
        x2="332"
        y1="209"
        y2="57"
      >
        <stop offset=".015" stop-color={disabled ? "white" : "#83839e"} />
        <stop offset="1" stop-color={disabled ? "white" : "#b8b8c7"} />
      </linearGradient>
      <g id="_08-money" data-name="08-money">
        <g id="linear_color" data-name="linear color">
          <circle
            cx="256"
            cy="312"
            fill="url(#New_Gradient_Swatch_5)"
            r="176.604"
          />
          <path
            d="m81 61 175-48 177 48-177 88z"
            fill="url(#New_Gradient_Swatch_3)"
          />
          <path
            d="m368 173c-64-32-160-32-224 0v-80c64-32 160-32 224 0z"
            fill="url(#New_Gradient_Swatch_18)"
          />
          <path fill={COLORS.DEFAULT} d="m380 169.906v-69.151l58.343-29.01a12 12 0 0 0 -2.2-22.327l-177-48a12.017 12.017 0 0 0 -6.315.009l-173.584 47.611a11.991 11.991 0 0 0 -11.244 11.962v60h-4a12 12 0 0 0 0 24h4v28a12 12 0 0 0 24 0v-28h4a12 12 0 0 0 0-24h-4v-41.037l40 20.113v69.839a190.341 190.341 0 0 0 -44.418 57.113 186.655 186.655 0 0 0 -20.182 84.972c0 104 84.6 188.6 188.6 188.6s188.6-84.6 188.6-188.6a188.14 188.14 0 0 0 -64.6-142.094zm-224-15.306v-54.009c58.42-26.2 141.579-26.2 200 0v54.009c-29.43-11.417-64.229-17.6-100-17.6s-70.57 6.183-100 17.6zm100.018-129.162 143.361 38.878-31.159 15.493c-31.773-14.728-71.354-22.809-112.22-22.809-40.571 0-79.88 7.957-111.535 22.481l-30.165-15.17zm-.018 451.162c-90.761 0-164.6-73.839-164.6-164.6-.108-52.418 24.352-100.3 66-132 57.665-25.291 138.693-25.386 196.535-.286a165.243 165.243 0 0 1 66.665 132.286c0 90.761-73.839 164.6-164.6 164.6z" />
          <path fill={COLORS.DEFAULT} d="m244 244h37a19.021 19.021 0 0 1 19 19 12 12 0 0 0 24 0 43.049 43.049 0 0 0 -43-43h-13v-20a12 12 0 0 0 -24 0v20a56 56 0 0 0 0 112h24a32 32 0 0 1 0 64h-36a20.023 20.023 0 0 1 -20-20 12 12 0 0 0 -24 0 44.049 44.049 0 0 0 44 44h12v12a12 12 0 0 0 24 0v-12a56 56 0 0 0 0-112h-24a32 32 0 0 1 0-64z" />
        </g>
      </g>
    </svg>
  );
}
