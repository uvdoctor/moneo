import React from "react";

interface SVGSaveProps {
  disable?: boolean;
}

export default function SVGSave({ disable }: SVGSaveProps) {
  return (
    <svg
      className={`w-6 ${
        disable ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      viewBox="0 0 64 64"
    >
      <g>
        <path
          d="m49 3v17a2 2 0 0 1 -2 2h-30a2 2 0 0 1 -2-2v-17h-8a4 4 0 0 0 -4 4v50a4 4 0 0 0 4 4h2v-26a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v26h2a4 4 0 0 0 4-4v-46l-8-8z"
          fill={`${disable ? "gray" : "#9bc9ff"}`}
        />
        <path d="m39 7h6v11h-6z" fill="gray" />
        <g fill={`${disable ? "gray" : "black"}`}>
          <path d="m61.707 10.293-8-8a1 1 0 0 0 -.707-.293h-46a5.006 5.006 0 0 0 -5 5v50a5.006 5.006 0 0 0 5 5h50a5.006 5.006 0 0 0 5-5v-46a1 1 0 0 0 -.293-.707zm-13.707-6.293v16a1 1 0 0 1 -1 1h-30a1 1 0 0 1 -1-1v-16zm-38 56v-25a3 3 0 0 1 3-3h38a3 3 0 0 1 3 3v25zm50-3a3 3 0 0 1 -3 3h-1v-25a5.006 5.006 0 0 0 -5-5h-38a5.006 5.006 0 0 0 -5 5v25h-1a3 3 0 0 1 -3-3v-50a3 3 0 0 1 3-3h7v16a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3v-16h2.586l7.414 7.414z" />
          <path d="m39 19h6a1 1 0 0 0 1-1v-11a1 1 0 0 0 -1-1h-6a1 1 0 0 0 -1 1v11a1 1 0 0 0 1 1zm1-11h4v9h-4z" />
          <path d="m47 45h-30a1 1 0 0 0 0 2h30a1 1 0 0 0 0-2z" />
          <path d="m47 39h-30a1 1 0 0 0 0 2h30a1 1 0 0 0 0-2z" />
          <path d="m47 51h-30a1 1 0 0 0 0 2h30a1 1 0 0 0 0-2z" />
        </g>
      </g>
    </svg>
  );
}
