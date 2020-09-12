import React, { Fragment, useEffect, useState } from "react";
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
      className={`w-full top-0 pb-1 z-10 ${
        !parentStyleDiff ? "fixed z-10" : "text-silver static"
      } text-base md:text-lg lg:text-xl`}
      style={{
        backgroundImage: `linear-gradient(to right, ${COLORS.SILVER}, ${
          parentStyleDiff ? "#7dc13a" : "white"
        })`,
      }}
    >
      <div className="w-full flex justify-between cursor font-bold items-end">
        <LogoWithName />
        {isMobileDevice(fsb) ? (
          <Fragment>
            <label className="whitespace-no-wrap">Your Financial Analyst</label>
            <div
              className="cursor-pointer pr-1"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <SVGClose coverPage={parentStyleDiff} />
              ) : (
                <SVGMenu coverPage={parentStyleDiff} />
              )}
              {showMobileMenu && (
                <Dropdown
                  parentStyleDiff={parentStyleDiff}
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
          </Fragment>
        ) : (
          <Menu
            parentStyleDiff={parentStyleDiff}
            parentStyleDiffHandler={parentStyleDiffHandler}
            topMargin={topMargin}
          />
        )}
      </div>
    </nav>
  );
}
