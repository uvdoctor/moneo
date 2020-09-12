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
  const getCoverHeight = () => Math.round((fsb.info.innerWidth * 3) / 5);
  const [coverHeight, setCoverHeight] = useState<number>(getCoverHeight());

  useEffect(() => {
    setCoverHeight(getCoverHeight());
  }, []);

  useEffect(() => {
    setCoverHeight(getCoverHeight());
  }, [fsb.info.innerWidth]);

  return (
    <Fragment>
      <div
        className="flex flex-col bg-contain xl:bg-cover xl:bg-center xl:bg-fixed bg-no-repeat w-screen h-48 xl:h-screen"
        style={{
          minHeight: coverHeight + "px",
          backgroundImage: `url('images/cover.jpg')`,
          maxWidth: "1400px",
        }}
      >
        <Header
          parentStyleDiff={coverPage}
          parentStyleDiffHandler={setCoverPage}
        />
        <div
          className={`flex flex-col md:mt-1 ml-2 md:ml-4 lg:ml-8
        font-bold xs:text-xs sm:text-base md:text-xl lg:text-2xl`}
        >
          {!isMobileDevice(fsb) && (
            <h1 className="mr-2">Your Financial Analyst for</h1>
          )}
          <div className="flex flex-col md:flex-row text-green-primary md:text-2xl lg:text-3xl xl:text-4xl">
            <h1>Stress-free Savings &</h1>
            <h1 className="md:ml-2">Investments</h1>
          </div>
          {!isMobileDevice(fsb) && (
            <div className="md:mt-2 lg:mt-4">
              <JoinUs />
            </div>
          )}
        </div>
      </div>
      {isMobileDevice(fsb) && <JoinUs />}
    </Fragment>
  );
};

export default Landing;
