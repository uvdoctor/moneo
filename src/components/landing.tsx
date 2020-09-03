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
    setCoverHeight(Math.round((fsb.info.innerWidth * 4) / 5));
  }, [fsb.info.innerWidth]);

  return (
    <div
      className="relative overflow-hidden bg-contain bg-no-repeat w-screen 
      flex flex-col items-end text-silver-primary font-bold
      xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl"
      style={{
        height: `${coverHeight}px`,
        backgroundImage: `url('images/relaxedwoman.jpeg')`,
      }}
    >
      <div className="w-full mt-10 md:mt-24 lg:mt-36 flex justify-between items-center">
        <div className="ml-4 md:ml-8 lg:ml-16 xl:ml-32 flex flex-col items-center">
          <label>Your Financial Analyst</label>
          <div className="flex">
            <label>for</label>
            <label className="ml-2 text-green-primary">Stress-free</label>
          </div>
          <div className="flex">
            <label>Savings & Investments</label>
            <label className="text-green-primary">.</label>
          </div>
        </div>
        <div className="md:mr-4 lg:mr-8 xl:mr-16">
          <Link href={ROUTES.DASHBOARD}>
            <a>
              <AwesomeButton
                ripple
                style={{ animation: "fadeIn 2s ease-in 1" }}
              >
                PLAN
                <div className="ml-1 md:ml-4 w-6 h-6 md:w-8 md:h-8">
                  {svgCtr % 5 === 1 && (
                    <HomeSVG animationStyle={animationStyle} />
                  )}
                  {svgCtr % 5 === 2 && (
                    <CarSVG animationStyle={animationStyle} />
                  )}
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
      <div
        className="text-xl md:text-4xl lg:text-6xl 
      mr-2 md:mr-4 xl:mr-12 lg:mt-8 xl:mt-16"
      >
        DARWIN
      </div>
    </div>
  );
};

export default Landing;
