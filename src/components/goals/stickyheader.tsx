import React, {ReactNode} from "react";
import SVGLogo from "../svglogo";
import SVGClose from "../svgclose";
import FullScreen from "../fullscreen";

interface StickyHeaderProps {
  children: ReactNode
  cancelCallback: Function;
}

export default function StickyHeader({ children, cancelCallback }: StickyHeaderProps) {
  return (
    <div className="container mx-auto flex pb-4 w-full justify-between items-start">
      <div onClick={() => cancelCallback()}>
        <SVGLogo />
      </div>
      {children}
      <div className="mr-1">
        <div
          className="mb-1 cursor-pointer border-0 outline-none focus:outline-none"
          onClick={() => cancelCallback()}
        >
          <SVGClose />
        </div>
        <FullScreen />
      </div>
    </div>
  );
}
