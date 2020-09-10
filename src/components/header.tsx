import React, { Fragment } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";
import LogoWithName from "./logowithname";
import SVGMenu from "./svgmenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";

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
      className={`top-0 ${
        !parentStyleDiff
          ? "fixed bg-white text-default p-1 z-10 h-10"
          : "bg-transparent text-silver"
      } text-base md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap cursor font-bold`}
    >
      <LogoWithName />
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
