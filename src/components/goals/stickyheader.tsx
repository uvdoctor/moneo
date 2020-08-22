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
    <div className="container mx-auto flex mb-1 w-full h-full items-end justify-between">
      <div className="flex flex-col h-full items-center" onClick={() => !cancelDisabled && cancelCallback()}>
      <SVGLogo />
      <label className="mt-1 hover:text-blue-600">Back</label>
      </div>
      {children}
      <div className="mr-1 flex flex-col h-full">
        <div
          className={`mb-6 ${
            cancelDisabled ? "cursor-not-allowed" : "cursor-pointer"
          } border-0 outline-none focus:outline-none`}
          onClick={() => !cancelDisabled && cancelCallback()}
        >
          <SVGClose />
        </div>
        <FullScreen />
      </div>
    </div>
  );
}
