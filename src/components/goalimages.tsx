import React, { Fragment, useEffect, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import CarSVG from "./goals/svgcar";
import DegreeSVG from "./goals/svgdegree";
import DiamondSVG from "./goals/svgdiamond";
import HomeSVG from "./goals/svghome";
import TravelSVG from "./goals/svgtravel";

export default function GoalImages() {
  const animationStyle = "transient 2s linear";
  const [svgCtr, setSvgCtr] = useState(-1);

  useEffect(() => {
    let timer = setTimeout(() => {
      setSvgCtr(svgCtr + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [svgCtr]);

  return (
    <Fragment>
      {svgCtr % 5 === 1 && <HomeSVG animationStyle={animationStyle} />}
      {svgCtr % 5 === 2 && <CarSVG animationStyle={animationStyle} />}
      {svgCtr % 5 === 3 && <DiamondSVG animationStyle={animationStyle} />}
      {svgCtr % 5 === 4 && <DegreeSVG animationStyle={animationStyle} />}
      {svgCtr % 5 === 0 && <TravelSVG animationStyle={animationStyle} />}
    </Fragment>
  );
}
