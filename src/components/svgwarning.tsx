import React from "react";

export default function SVGWarning() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 -m-6"
    >
      <path fill="orange"
        d="M17 12.1a7 7 0 1 1-10 0V5a5 5 0 1 1 10 0v7.1zm-1.43 1.4l-.57-.58V5a3 3 0 0 0-6 0v7.92l-.57.58a5 5 0 1 0 7.14 0z"
      />
      <path
        fill="orange"
        d="M11 14.17V10a1 1 0 0 1 2 0v4.17a3 3 0 1 1-2 0z"
      />
    </svg>
  );
}
