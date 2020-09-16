import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";
import LogoWithName from "./logowithname";
import SVGMenu from "./svgmenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { HOME_ANCHORS } from "../CONSTANTS";
import Dropdown from "./dropdown";
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
      className={`w-full flex justify-between cursor fixed font-bold items-end top-0 pb-1 z-10 ${
        (!parentStyleDiff || showMobileMenu) ? "fixed bg-white" : "sticky"
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
            {showMobileMenu && (
              <Dropdown
                options={{
                  Calculate: HOME_ANCHORS.CALCULATE,
                  Features: HOME_ANCHORS.FEATURES,
                  Pricing: HOME_ANCHORS.PRICE,
                  Company: HOME_ANCHORS.COMPANY,
                  "Join Waitlist": HOME_ANCHORS.JOIN,
                }}
              />
            )}
          </div>
        ) : (
          <Menu parentStyleDiffHandler={parentStyleDiffHandler} />
        )}
      </div>
    </nav>
  );
}
