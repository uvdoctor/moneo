import React, { useState, useEffect } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import Logo from "./logo";
import Menu from "./menu";
import { getLandingPageHeight, isMobileDevice } from "./utils";
import LandingButton from "./landingbutton";

const Landing = () => {
  const fsb = useFullScreenBrowser();
  const [coverHeight, setCoverHeight] = useState<number>(800);
  const [coverPage, setCoverPage] = useState<boolean>(true);

  useEffect(() => {
    setCoverHeight(getLandingPageHeight(fsb));
  }, [fsb.info.innerWidth]);

  return (
    <div
      className="flex flex-col bg-cover w-screen"
      style={{
        minHeight: coverHeight + "px",
        backgroundImage: `url('images/relaxedwoman.png')`,
      }}
    >
      <nav
        className={`${
          !coverPage ? "bg-silver text-default" : "bg-transparent text-silver"
        } md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap py-1 cursor font-bold`}
      >
        <Logo />
        <Menu
          parentStyleDiff={coverPage}
          parentStyleDiffHandler={setCoverPage}
        />
      </nav>
      <div
        className={`w-full flex flex-col justify-start items-start
            md:justify-center md:items-center md:flex-row"
        text-silver font-bold xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl 
      md:mt-4 lg:mt-8 xl:mt-12`}
      >
        <div className="ml-4 md:mr-48 lg:mr-64 flex flex-col items-center">
          <label>Your Financial Analyst</label>
          <div className="flex">
            <label>for</label>
            <label className="ml-2 text-green-primary">Stress-free</label>
          </div>
          <label>Savings & Investments</label>
          {fsb.info.innerWidth >= 768 && (
            <div className="flex flex-col items-center mt-2 lg:mt-4">
              <LandingButton text="MEET MY GOALS" />
              <label className="mt-1 text-base">Across Currencies</label>
            </div>
          )}
        </div>
        {isMobileDevice(fsb) && (
          <div className="w-full flex justify-end md:pr-4 mt-10">
            <LandingButton text="PLAN" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
