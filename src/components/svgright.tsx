import React from "react";

interface SVGRightProps {
    disable?: boolean
}

export default function SVGRight({disable} : SVGRightProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <circle cx="12" cy="12" r="10" fill={`${disable ? '#cbd5e0' : '#3182ce'}`} />
      <path fill="white"
        d="M12 14H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h5V8a1 1 0 0 1 1.7-.7l4 4a1 1 0 0 1 0 1.4l-4 4A1 1 0 0 1 12 16v-2z"
      />
    </svg>
  );
}
