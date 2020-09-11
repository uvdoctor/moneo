import React, { Fragment, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";
import Header from "./header";
import JoinUs from "./joinus";

const Landing = () => {
  const fsb = useFullScreenBrowser();
  const [coverPage, setCoverPage] = useState<boolean>(true);

  return (
    <Fragment>
      <div
        className="flex flex-col bg-contain bg-no-repeat w-screen"
        style={{
          height: fsb.info.innerWidth * 3/5 + "px",
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
          <div className="w-full flex flex-wrap text-green-primary md:text-2xl lg:text-3xl xl:text-4xl">
            {!isMobileDevice(fsb) && (
              <label className="mr-2">Your Financial Analyst for</label>
            )}
            <label>Stress-free Savings & Investments</label>
          </div>
          {!isMobileDevice(fsb) && <div className="md:mt-2 lg:mt-4"><JoinUs /></div>}
        </div>
      </div>
      {isMobileDevice(fsb) && <JoinUs />}
    </Fragment>
  );
};

export default Landing;
