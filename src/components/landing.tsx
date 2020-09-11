import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";
import GoalImages from "./goalimages";
import Header from "./header";
import JoinUs from "./joinus";

const Landing = () => {
  const fsb = useFullScreenBrowser();
  const [coverPage, setCoverPage] = useState<boolean>(true);

  return (
    <div
      className="flex flex-col bg-cover bg-center w-screen h-screen"
      style={{
        height: isMobileDevice(fsb) ? fsb.info.innerWidth+"px" : "",
        backgroundImage: `url('images/countryside.jpeg')`,
      }}
    >
      <Header
        parentStyleDiff={coverPage}
        parentStyleDiffHandler={setCoverPage}
      />
      <div
        className={`w-full flex flex-col justify-center items-center text-white mt-1 md:mt-2 lg:mt-4 ml-2 md:ml-4 lg:ml-8 
        font-bold xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl`}
      >
        {!isMobileDevice(fsb) && <label>Your Financial Analyst for</label>}
        <label>
          Stress-free Savings & Investments to
        </label>
        <div className="w-full flex justify-center items-center">
          Meet Your Goals
          <GoalImages />
        </div>
      <JoinUs />
      </div>
    </div>
  );
};

export default Landing;
