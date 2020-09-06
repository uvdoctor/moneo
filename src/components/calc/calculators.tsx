import React from "react";
import Section from "../form/section";
import SVGHourGlass from "../svghourglass";
import SVGScale from "../svgscale";
import { ROUTES } from "../../CONSTANTS";
import SVGBalance from "./svgbalance";
import SVGFreedom from "../svgfreedom";
import SVGPiggy from "../svgpiggy";
import SVGMoneyBag from "./svgmoneybag";
import SVGLoan from "../svgloan";

interface CalculatorsProps {
  insideMenu?: boolean;
  insideForm?: boolean;
}

export default function Calculators({
  insideMenu,
  insideForm,
}: CalculatorsProps) {
  const LIGHT_COLORS = {
    RED: "#EEA894",
    ORANGE: "#fbd38d",
    BLUE: "#90cdf4",
    TEAL: "#81e6d9",
    PURPLE: "#d6bcfa",
    YELLOW: "#faf089",
    GRAY: "#cbd5e0",
    PINK: "#f687b3",
    BROWN: "#D3B193",
    //GRAY: "#EEEBEA",
    //GREEN: "DBEAE9"
    GREEN: "#9ae6b4",
  };

  return (
    <div className="w-full flex flex-wrap items-start justify-around pb-1 text-white">
          <Section
            title="Financial Freedom"
            titleSVG={<SVGFreedom />}
            left={
              <div className={`flex ${insideMenu ? 'flex-col' : 'flex-wrap justify-between'}`}>
                <div className="flex items-center mb-1">
                  <SVGPiggy selected />
                  <span className="ml-1">How Much Money?</span>
                </div>
                <div className="flex items-center">
                  <SVGHourGlass />
                  <span className="ml-1">By When?</span>
                </div>
              </div>
            }
            hasResult
            insideMenu={insideMenu}
            insideForm={insideForm}
            color={LIGHT_COLORS.RED}
            link={ROUTES.DASHBOARD}
            imgSrc="images/step1.png"
            videoSrc={`https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`}
          />
          <Section
            titleSVG={<SVGScale disabled={false} selected />}
            title="Buy v/s Rent"
            left={
              <ul>
                <li className="flex items-center mb-1">
                  <SVGBalance />
                  <span className="ml-1">Which is Cheaper?</span>
                </li>
                <li className="flex items-center">
                  <SVGHourGlass />
                  <span className="ml-1">For how many Years?</span>
                </li>
              </ul>
            }
            hasResult
            insideMenu={insideMenu}
            insideForm={insideForm}
            color={LIGHT_COLORS.BROWN}
            link={ROUTES.DASHBOARD}
            imgSrc="images/step1.png"
            videoSrc={`https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`}
          />
          <Section
            title="Mortgage Loan"
            titleSVG={<SVGLoan selected />}
            left={
              <ul>
                <li className="flex items-center mb-1">
                  <SVGBalance />
                  <span className="ml-1">Pay by Self or Loan?</span>
                </li>
                <li className="flex items-center">
                  <SVGMoneyBag selected />
                  <span className="ml-1">How much Total Interest?</span>
                </li>
              </ul>
            }
            hasResult
            insideMenu={insideMenu}
            insideForm={insideForm}
            color={LIGHT_COLORS.ORANGE}
            imgSrc="images/step2.png"
            videoSrc={`https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`}
          />
          <Section
            title="Education Loan"
            titleSVG={<SVGLoan selected />}
            left={
              <ul>
                <li className="flex items-center mb-1">
                  <SVGBalance />
                  <span className="ml-1">Pay by Self or Loan?</span>
                </li>
                <li className="flex items-center">
                  <SVGMoneyBag selected />
                  <span className="ml-1">How much Total Interest?</span>
                </li>
              </ul>
            }
            hasResult
            insideMenu={insideMenu}
            insideForm={insideForm}
            color={LIGHT_COLORS.GREEN}
            link={ROUTES.PLAN}
            imgSrc="images/step3.png"
            videoSrc={`https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`}
          />
    </div>
  );
}
