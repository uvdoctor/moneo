import React, { useState, useEffect } from "react";
import { COLORS, ROUTES } from "../CONSTANTS";
import Link from "next/link";
import HomeSVG from "./goals/svghome";
import CarSVG from "./goals/svgcar";
import DiamondSVG from "./goals/svgdiamond";
import DegreeSVG from "./goals/svgdegree";
import TravelSVG from "./goals/svgtravel";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { useFullScreenBrowser } from "react-browser-hooks";
import Logo from "./logo";
import Menu from "./menu";
import { getLandingPageHeight } from "./utils";

const Landing = () => {
  const [svgCtr, setSvgCtr] = useState(-1);
  const animationStyle = "transient 2s linear";
  const fsb = useFullScreenBrowser();
  const [coverHeight, setCoverHeight] = useState<number>(
    800
    );

  useEffect(() => {
    let timer = setTimeout(() => {
      setSvgCtr(svgCtr + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [svgCtr]);

  useEffect(() => {
    setCoverHeight(getLandingPageHeight(fsb));
  }, [fsb.info.innerWidth]);

  return (
    <div
      className="flex flex-col bg-contain bg-no-repeat"
      style={{
        width: `${fsb.info.innerWidth}px`,
        height: `${coverHeight}px`,
        backgroundImage: `url('images/relaxedwoman.png')`,
      }}
    >
      <nav
        className="md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap py-1 cursor font-bold"
        style={{ color: COLORS.SILVER }}
      >
        <Logo />
        <Menu />
      </nav>
      <div
        className="w-full flex justify-between items-start md:items-center text-silver-primary font-bold
      xs:text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl 
      md:mt-4 lg:mt-8 xl:mt-12"
      >
        <div className="sm:ml-2 md:ml-16 lg:ml-24 xl:ml-48 flex flex-col items-center">
          <label>Your Financial Analyst</label>
          <div className="flex">
            <label>for</label>
            <label className="ml-2 text-green-primary">Stress-free</label>
          </div>
          <label>Savings & Investments</label>
        </div>
        <div className="md:mr-4 lg:mr-8">
          <Link href={ROUTES.DASHBOARD}>
            <a>
              <AwesomeButton
                ripple
                size={`${fsb.info.innerWidth < 800 ? 'auto' : 'large'}`}
                style={{ animation: "fadeIn 2s ease-in 1" }}
              >
                {`${fsb.info.innerWidth > 800 ? 'SET GOALS' : 'PLAN'}`}
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
    </div>
  );
};

export default Landing;
