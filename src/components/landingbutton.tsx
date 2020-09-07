import React, { useEffect, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import CarSVG from "./goals/svgcar";
import DegreeSVG from "./goals/svgdegree";
import DiamondSVG from "./goals/svgdiamond";
import HomeSVG from "./goals/svghome";
import TravelSVG from "./goals/svgtravel";
import { ROUTES } from "../CONSTANTS";
import Link from "next/link";

interface LandingButtonProps {
  text: string;
}
export default function LandingButton({ text }: LandingButtonProps) {
  const animationStyle = "transient 2s linear";
  const [svgCtr, setSvgCtr] = useState(-1);

  useEffect(() => {
    let timer = setTimeout(() => {
      setSvgCtr(svgCtr + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [svgCtr]);

  return (
    <Link href={ROUTES.DASHBOARD}>
      <a>
        <AwesomeButton ripple style={{ animation: "fadeIn 2s ease-in 1" }}>
          {text}
          <div className="ml-1 md:ml-4 w-6 h-6 md:w-8 md:h-8">
            {svgCtr % 5 === 1 && <HomeSVG animationStyle={animationStyle} />}
            {svgCtr % 5 === 2 && <CarSVG animationStyle={animationStyle} />}
            {svgCtr % 5 === 3 && <DiamondSVG animationStyle={animationStyle} />}
            {svgCtr % 5 === 4 && <DegreeSVG animationStyle={animationStyle} />}
            {svgCtr % 5 === 0 && <TravelSVG animationStyle={animationStyle} />}
          </div>
        </AwesomeButton>
      </a>
    </Link>
  );
}
