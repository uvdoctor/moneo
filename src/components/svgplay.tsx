import React from "react";
import { COLORS } from "../CONSTANTS";

export default function SVGPlay() {
  return (
    <svg
      enableBackground="new 0 0 512 512"
      className="w-6 cursor-pointer"
      viewBox="0 0 512 512"
    >
      <g>
        <g fill="white">
          <path d="m15 406v60h241 241v-60h-241z" />
          <path d="m256 46h-241v60h241 241v-60z" />
        </g>
        <path d="m256 46h241v60h-241z" fill="white" />
        <path d="m256 406h241v60h-241z" fill="white" />
        <path d="m256 106h-226v300h226 226v-300z" fill="white" />
        <path d="m256 106h226v300h-226z" fill="white" />
        <g>
          <g fill="#404a80">
            <path d="m0 391v90h256 256v-90h-256zm81 60h-51v-30h51zm80 0h-50v-30h50zm80 0h-50v-30h50zm190-30h51v30h-51zm-80 0h50v30h-50zm-80 0h50v30h-50z" />
            <path d="m256 31h-256v90h256 256v-90zm-175 60h-51v-30h51zm80 0h-50v-30h50zm80 0h-50v-30h50zm80 0h-50v-30h50zm80.001 0h-50.001v-30h50.001zm80.999 0h-51.099v-30h51.099z" />
          </g>
          <g fill="#283366">
            <path d="m321 91h-50v-30h50zm80.001 0h-50.001v-30h50.001zm-145.001-60v90h256v-90zm226 60h-51.099v-30h51.099z" />
            <path d="m512 391h-256v90h256zm-191 60h-50v-30h50zm80 0h-50v-30h50zm81 0h-51v-30h51z" />
          </g>
        </g>
        <path
          d="m256 197.976-45-29.998v176.044l45-29.998 87.041-58.024z"
          fill={COLORS.GREEN}
        />
        <path d="m256 197.976v116.048l87.041-58.024z" fill={COLORS.GREEN} />
      </g>
    </svg>
  );
}
