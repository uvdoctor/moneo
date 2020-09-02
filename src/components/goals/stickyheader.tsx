import React, { ReactNode } from "react";
import SVGLogo from "../svglogo";
import SVGClose from "../svgclose";
import FullScreen from "../fullscreen";

interface StickyHeaderProps {
  children: ReactNode;
  cancelDisabled: boolean;
  cancelCallback: Function;
}

export default function StickyHeader({
  children,
  cancelDisabled,
  cancelCallback,
}: StickyHeaderProps) {
  return (
    <div className="container mx-auto flex mb-2 w-full justify-between">
      <div
        className="flex flex-col items-center"
        onClick={() => !cancelDisabled && cancelCallback()}
      >
        <SVGLogo />
        <label
          className={`mt-6 ${
            cancelDisabled
              ? "text-gray-400"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          Back
        </label>
      </div>
      <div className="w-full flex justify-around max-w-sm md:max-w-md">{children}</div>
      <div className="mr-1 flex flex-col h-full">
        <div
          className={`mb-10 ${
            cancelDisabled ? "cursor-not-allowed" : "cursor-pointer"
          } border-0 outline-none focus:outline-none`}
          onClick={() => !cancelDisabled && cancelCallback()}
        >
          <SVGClose disable={cancelDisabled} />
        </div>
        <FullScreen />
      </div>
    </div>
  );
}
