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
    <div className="flex mb-2 w-full justify-between">
      <div
        className="ml-1 flex flex-col items-center"
        onClick={() => !cancelDisabled && cancelCallback()}
      >
        <div className="mt-1">
          <SVGLogo />
        </div>
        <label
          className={`mt-5 ${
            cancelDisabled
              ? "text-gray-400"
              : "cursor-pointer hover:text-green-primary"
          }`}
        >
          Back
        </label>
      </div>
      <div className="w-full flex justify-around max-w-sm md:max-w-md">
        {children}
      </div>
      <div className="mt-2 mr-1 flex flex-col h-full">
        <div
          className={`mb-6 ${
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
