import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";
import LogoWithName from "./logowithname";
import SVGMenu from "./svgmenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import SVGClose from "./svgclose";

interface HeaderProps {
  parentStyleDiff?: boolean;
  parentStyleDiffHandler?: Function;
}

export default function Header({ parentStyleDiff, parentStyleDiffHandler }: HeaderProps) {
  const fsb = useFullScreenBrowser();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  return (
    <nav
      className={`w-full flex justify-between cursor font-bold items-end top-0 pb-1 z-10 ${
        (!parentStyleDiff || showMobileMenu) ? "fixed bg-white" : "static"
      } text-base md:text-lg lg:text-xl`}
    >
      <LogoWithName />
      <div className="w-full flex items-center justify-end">
        {isMobileDevice(fsb) ? (
          <div
            className="w-full flex justify-end cursor-pointer pr-1"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <SVGClose /> : <SVGMenu />}
          </div>
        ) : (
          <Menu parentStyleDiffHandler={parentStyleDiffHandler} />
        )}
      </div>
    </nav>
  );
}
