import React from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";
import LogoWithName from "./logowithname";
import SVGMenu from "./svgmenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import Logo from "./logo";
import { COLORS } from "../CONSTANTS";

interface HeaderProps {
  parentStyleDiff?: boolean;
  parentStyleDiffHandler?: Function;
}

export default function Header({
  parentStyleDiff,
  parentStyleDiffHandler,
}: HeaderProps) {
  const fsb = useFullScreenBrowser();
  return (
    <nav
      className={`top-0 pb-1 ${
        !parentStyleDiff
          ? "fixed z-10"
          : "text-silver"
      } text-base md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap cursor font-bold`}
    style={{backgroundImage: `linear-gradient(to right, ${COLORS.SILVER}, ${parentStyleDiff ? COLORS.DEFAULT : COLORS.LIGHT_GRAY})`}}>
      {parentStyleDiff ? <Logo /> : <LogoWithName />}
      {isMobileDevice(fsb) ? (
        <div className="w-3/4 flex justify-between">
          <label className="whitespace-no-wrap">Your Financial Analyst</label>
          <div className="cursor-pointer" onClick={() => {}}>
            <SVGMenu coverPage={parentStyleDiff} />
          </div>
        </div>
      ) : (
        <Menu
          parentStyleDiff={parentStyleDiff}
          parentStyleDiffHandler={parentStyleDiffHandler}
        />
      )}
    </nav>
  );
}
