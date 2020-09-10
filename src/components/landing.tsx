import React, { useState, useEffect } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import { getLandingPageHeight, isMobileDevice } from "./utils";
import GoalImages from "./goalimages";
import Header from "./header";

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
      <Header
        parentStyleDiff={coverPage}
        parentStyleDiffHandler={setCoverPage}
      />
      <div
        className={`w-full flex flex-col mt-1 md:mt-2 lg:mt-4 ml-2 md:ml-4 lg:ml-8 
        text-silver font-bold xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl`}
      >
        {!isMobileDevice(fsb) && <label>Your Financial Analyst for</label>}
        <label className="text-green-secondary">
          Stress-free Savings & Investments to
        </label>
        <div className="w-full flex items-center text-green-primary">
          Meet Your Goals
          <GoalImages />
        </div>
      </div>
    </div>
  );
};

export default Landing;
