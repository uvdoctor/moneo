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
      className="mt-12 text-white overflow-hidden bg-contain bg-no-repeat w-screen"
      style={{
        height: `${coverHeight}px`,
        backgroundImage: `url('images/relaxedwoman.jpeg')`,
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center pr-20 pb-8">
        <Link href={ROUTES.DASHBOARD}>
          <a>
            <button className="button flex items-center rounded-full py-2 px-4 font-semibold"
              style={{ animation: "fadeIn 2s ease-in 1" }}
            >
              Plan
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
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
