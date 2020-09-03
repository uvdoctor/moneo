import React, { useState, useEffect } from "react";
import { ROUTES } from "../CONSTANTS";
import Link from "next/link";
import HomeSVG from "./goals/svghome";
import CarSVG from "./goals/svgcar";
import DiamondSVG from "./goals/svgdiamond";
import DegreeSVG from "./goals/svgdegree";
import TravelSVG from "./goals/svgtravel";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";

const Landing = () => {
  const [svgCtr, setSvgCtr] = useState(-1);
  const animationStyle = "transient 2s linear";
  const [coverHeight, setCoverHeight] = useState<number>(800);
  const fsb = useFullScreenBrowser();

  useEffect(() => {
    let timer = setTimeout(() => {
      setSvgCtr(svgCtr + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [svgCtr]);

  useEffect(() => {
    setCoverHeight(Math.round((fsb.info.innerWidth * 3) / 5));
  }, [fsb.info.innerWidth]);

  return (
    <div
      className="relative overflow-hidden bg-contain bg-no-repeat w-screen h-full"
      style={{
        height: `${coverHeight}px`,
        backgroundImage: `url('images/relaxedwoman.png')`,
      }}
    >
      <div
        className="w-2/3 md:w-3/4 flex flex-col text-silver-primary
      flex flex-col xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl 
      xs:font-semibold sm:font-bold mt-10 md:mt-16 lg:mt-24 xl:mt-32
      xs:justify-start justify-center items-center"
      >
        <label>Your Financial Analyst</label>
        <div className="flex items-end">
          <label>for</label>
          <label className="ml-2 text-green-primary">Stress-free</label>
        </div>
        <div className="flex">
          <label>Savings & Investments</label>
          <label className="text-green-primary">.</label>
        </div>
      </div>
      <div className="w-full pr-4 md:pr-20 lg:pr-32 xl:pr-40 
      mt-4 sm:mt-40 pt-4 md:pt-0 md:mt-8 lg:mt-12 flex items-end justify-end">
        <Link href={ROUTES.DASHBOARD}>
          <a>
            <AwesomeButton ripple style={{ animation: "fadeIn 2s ease-in 1" }}>
              PLAN
              <div className="ml-1 md:ml-4 w-6 h-6 md:w-8 md:h-8">
                {svgCtr % 5 === 1 && (
                  <HomeSVG animationStyle={animationStyle} />
                )}
                {svgCtr % 5 === 2 && <CarSVG animationStyle={animationStyle} />}
                {svgCtr % 5 === 3 && (
                  <DiamondSVG animationStyle={animationStyle} />
                )}
                {svgCtr % 5 === 4 && (
                  <DegreeSVG animationStyle={animationStyle} />
                )}
                {svgCtr % 5 === 0 && (
                  <TravelSVG animationStyle={animationStyle} />
                )}
              </div>
            </AwesomeButton>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
