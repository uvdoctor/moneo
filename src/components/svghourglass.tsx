import React from "react";
import { COLORS } from "../CONSTANTS";

export default function SVGHourGlass() {
  return (
    <svg viewBox="0 0 24 24" className="w-8">
      <path
        stroke="#7b341e"
        fill={COLORS.LIGHT_GRAY}
        d="M19 20h1a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2h1c0-1.8.68-3.58 2.05-4.95L9 13.1v-2.2L7.05 8.95A6.98 6.98 0 0 1 5 4H4a1 1 0 1 1 0-2h16a1 1 0 0 1 0 2h-1c0 1.8-.68 3.58-2.05 4.95L15 10.9v2.2l1.95 1.95A6.98 6.98 0 0 1 19 20z"
      />
      <path
        fill="#4CAF50"
        d="M17 20H7l2.83-2.83A4 4 0 0 0 11 14.34v-4.27L8.46 7.54a5 5 0 0 1-.95-1.33c.17-.06.33-.13.49-.21a4.47 4.47 0 0 1 4 0c1.26.63 2.74.63 4 0 .23-.11.46-.2.7-.28a5 5 0 0 1-1.16 1.82L13 10.07v4.27a4 4 0 0 0 1.17 2.83L17 20z"
      />
    </svg>
  );
}
