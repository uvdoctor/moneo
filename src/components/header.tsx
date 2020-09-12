import React, { useEffect, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";
import LogoWithName from "./logowithname";
import SVGMenu from "./svgmenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { COLORS, HOME_ANCHORS } from "../CONSTANTS";
import Dropdown from "./dropdown";
import SVGClose from "./svgclose";

interface HeaderProps {
  parentStyleDiff?: boolean;
  parentStyleDiffHandler?: Function;
}

export default function Header({
  parentStyleDiff,
  parentStyleDiffHandler,
}: HeaderProps) {
  const fsb = useFullScreenBrowser();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const getTopMargin = () =>
    fsb.info.screenWidth < isMobileDevice(fsb) ? 33 : 14.5;
  const [topMargin, setTopMargin] = useState<number>(getTopMargin());

  useEffect(() => {
    setTopMargin(getTopMargin());
  }, [fsb.info.screenWidth]);

  return (
    <nav
      className={`top-0 pb-1 ${
        !parentStyleDiff ? "fixed z-10" : "text-silver"
      } text-base md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap cursor font-bold`}
      style={{
        backgroundImage: `linear-gradient(to right, ${COLORS.SILVER}, ${
          parentStyleDiff ? "#7dc13a" : "white"
        })`,
      }}
    >
      <LogoWithName />
      {isMobileDevice(fsb) ? (
        <div className="flex">
          <label className="whitespace-no-wrap mr-2">Your Financial Analyst</label>
          <div
            className="cursor-pointer pr-1"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <SVGClose coverPage={parentStyleDiff} /> : <SVGMenu coverPage={parentStyleDiff} />}
            {showMobileMenu && (
              <Dropdown
                parentStyleDiff={parentStyleDiff}
                options={{
                  Calculate: HOME_ANCHORS.CALCULATE,
                  Features: HOME_ANCHORS.FEATURES,
                  Pricing: HOME_ANCHORS.PRICE,
                  Company: HOME_ANCHORS.COMPANY,
                  "Join Waitlist": HOME_ANCHORS.JOIN
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <Menu
          parentStyleDiff={parentStyleDiff}
          parentStyleDiffHandler={parentStyleDiffHandler}
          topMargin={topMargin}
        />
      )}
    </nav>
  );
}
