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
  //const [coverHeight, setCoverHeight] = useState<number>(800);
  const [coverPage, setCoverPage] = useState<boolean>(true);

  /*useEffect(() => {
    setCoverHeight(getLandingPageHeight(fsb));
  }, [fsb.info.innerWidth]);*/

  return (
    <div
      className="flex flex-col bg-cover bg-no-repeat bg-center w-screen h-screen"
      style={{
        //minHeight: coverHeight + "px",
        backgroundImage: `url('images/familywall.jpg')`,
      }}
    >
      <Header
        parentStyleDiff={coverPage}
        parentStyleDiffHandler={setCoverPage}
      />
      <div
        className={`w-full flex flex-col mt-1 md:mt-2 lg:mt-4 ml-2 md:ml-4 lg:ml-8 
        font-bold xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl`}
      >
        {!isMobileDevice(fsb) && <label>Your Financial Analyst for</label>}
        <label className="text-green-primary">
          Stress-free Savings & Investments to
        </label>
        <div className="w-full flex items-center text-green-primary">
          Meet Your Goals
          <GoalImages />
        </div>
      </div>
      <JoinUs />
    </div>
  );
};

export default Landing;
