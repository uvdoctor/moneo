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
    <div className="container mx-auto flex mb-2 w-full h-full items-center justify-between">
      <div
        className="flex flex-col h-full items-center"
        onClick={() => !cancelDisabled && cancelCallback()}
      >
        <SVGLogo />
        <label className={`mt-1 ${cancelDisabled ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}>Back</label>
      </div>
      {children}
      <div className="mr-1 flex flex-col h-full">
        <div
          className={`mb-2 md:mb-4 ${
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
