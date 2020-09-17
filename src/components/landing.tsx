import React, { Fragment, useEffect, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import Header from "./header";
import JoinUs from "./joinus";
import { isMobileDevice } from "./utils";

const Landing = () => {
  const fsb = useFullScreenBrowser();
  const [coverPage, setCoverPage] = useState<boolean>(true);
  const getCoverHeight = () => Math.round((fsb.info.innerWidth * 3) / 5);
  const [coverHeight, setCoverHeight] = useState<number>(getCoverHeight());

  useEffect(() => {
    setCoverHeight(getCoverHeight());
  }, [fsb.info.innerWidth]);

  return (
    <Fragment>
      <div
        className={`bg-contain bg-no-repeat xl:bg-fixed w-full ${fsb.info.screenWidth < 300 ? 'h-40' : 'h-56'} xl:h-screen text-base md:text-lg lg:text-xl xl:text-2xl`}
        style={{
          minHeight: coverHeight + "px",
          backgroundImage: `url('images/cover.jpg')`,
          maxWidth: "1400px"
        }}
      >
        <Header
          parentStyleDiff={coverPage}
          parentStyleDiffHandler={setCoverPage}
        />
        <div className="md:mt-1 ml-1 md:ml-4 lg:ml-8 font-bold">
          <div className="flex flex-col md:flex-row text-green-primary md:text-2xl lg:text-3xl xl:text-4xl">
            <h1 className="mr-2">
              Stress-free Savings
            </h1>
            <h1> & Investments</h1>
          </div>
          {!isMobileDevice(fsb) && (
            <div className="mt-2 lg:mt-4">
              <JoinUs />
            </div>
          )}
        </div>
      </div>
      {isMobileDevice(fsb) && (
        <div className="w-full flex justify-center mb-4">
          <JoinUs />
        </div>
      )}
    </Fragment>
  );
};

export default Landing;
