import React, { Fragment, useEffect, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";
import Header from "./header";
import JoinUs from "./joinus";

const Landing = () => {
  const fsb = useFullScreenBrowser();
  const [coverPage, setCoverPage] = useState<boolean>(true);
  const getCoverHeight = () => Math.round(fsb.info.innerWidth * 3 / 5)
  const [coverHeight, setCoverHeight] = useState<number>(getCoverHeight())

  useEffect(() => {
    setCoverHeight(getCoverHeight())
  }, [fsb.info.innerWidth])
  
  return (
    <Fragment>
      <div
        className="flex flex-col bg-contain bg-no-repeat w-screen h-full"
        style={{
          height: coverHeight + "px",
          backgroundImage: `url('images/cover.jpg')`,
        }}
      >
        <Header
          parentStyleDiff={coverPage}
          parentStyleDiffHandler={setCoverPage}
        />
        <div
          className={`w-full flex flex-col mt-1 ml-2 
        font-bold xs:text-xs sm:text-base md:text-xl lg:text-2xl`}
        >
          <div className="w-full flex flex-wrap md:text-2xl lg:text-3xl xl:text-4xl">
            {!isMobileDevice(fsb) && (
              <label className="mr-2">Your Financial Analyst for</label>
            )}
            <label className="text-green-primary">Stress-free Savings & Investments</label>
          </div>
          {!isMobileDevice(fsb) && <div className="md:mt-2 lg:mt-4"><JoinUs /></div>}
        </div>
      </div>
      {isMobileDevice(fsb) && <JoinUs />}
    </Fragment>
  );
};

export default Landing;
