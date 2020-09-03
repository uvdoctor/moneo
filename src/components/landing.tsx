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
      className="mt-12 text-white overflow-hidden bg-contain bg-no-repeat"
      style={{
        width: `${fsb.info.innerWidth}px`,
        height: `${coverHeight}px`,
        backgroundImage: `url('images/relaxedwoman.png')`,
      }}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-center pr-32"
      >
        <Link href={ROUTES.DASHBOARD}>
          <a>
            <AwesomeButton
              ripple
			  type="link"
              style={{ animation: "fadeIn 2s ease-in 1" }}
            >
              SET GOALS
              <div className="ml-2 md:ml-4 w-8 h-8">
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
        <label className="mt-2">Across Currencies.</label>
      </div>
    </div>
  );
};

export default Landing;
