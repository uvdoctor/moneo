import React, { useState, useEffect, Fragment } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import Menu from "./menu";
import { getLandingPageHeight, isMobileDevice } from "./utils";
import GoalImages from "./goalimages";
import LogoWithName from "./logowithname";
import SVGMenu from "./svgmenu";

const Landing = () => {
  const fsb = useFullScreenBrowser();
  const [coverHeight, setCoverHeight] = useState<number>(800);
  const [coverPage, setCoverPage] = useState<boolean>(true);

  useEffect(() => {
    setCoverHeight(getLandingPageHeight(fsb));
  }, [fsb.info.innerWidth]);

  return (
    <div
      className="flex flex-col bg-contain bg-no-repeat lg:bg-cover xl:bg-fixed w-screen"
      style={{
        minHeight: coverHeight + "px",
        backgroundImage: `url('images/relaxedwoman.png')`,
      }}
    >
      <nav
        className={`${
          !coverPage ? "bg-white text-default" : "bg-transparent text-silver"
        } text-base md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap cursor font-bold`}
      >
        <LogoWithName />
        {isMobileDevice(fsb) ? (
          <Fragment>
            <label className="whitespace-no-wrap">Your Financial Analyst</label>
            <div className="cursor-pointer" onClick={() => {}}>
              <SVGMenu coverPage={coverPage} />
            </div>
          </Fragment>
        ) : (
          <Menu
            parentStyleDiff={coverPage}
            parentStyleDiffHandler={setCoverPage}
          />
        )}
      </nav>
      <div
        className={`w-full flex flex-col md:flex-row
        text-silver font-bold xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl`}
      >
        <div className="w-full mt-2 lg:mt-4 ml-2 md:ml-4 lg:ml-8 flex flex-col">
          {!isMobileDevice(fsb) && <label>Your Financial Analyst for</label>}
          <label className="text-green-primary">Stress-free Savings & Investments to</label>
          <div className="w-full flex items-center text-green-primary">
            Meet Your Goals            
            <GoalImages />
          </div>
        </div>
        {isMobileDevice(fsb) && (
          <div className="w-full flex justify-end md:pr-4 mt-10">
            <GoalImages />
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
