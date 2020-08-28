import React from "react";

interface SVGCloseProps {
    disable: boolean
}
export default function SVGClose({disable}: SVGCloseProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${disable ? 'cursor-not-allowed' : 'cursor-pointer'} w-6`}>
      <circle fill="none" stroke={`${disable ? 'gray' : '#38a169'}`} cx="12" cy="12" r="10" />
      <path
        fill="gray"
        d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"
      />
    </svg>
  );
}
