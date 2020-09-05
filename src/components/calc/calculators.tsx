import React from "react";
import Section from "../form/section";
import SVGHourGlass from "../svghourglass";
import SVGScale from "../svgscale";
import Link from "next/link";
import { ROUTES } from "../../CONSTANTS";
import SVGBalance from "./svgbalance";
import SVGFreedom from "../svgfreedom";
import SVGPiggy from "../svgpiggy";

interface CalculatorsProps {
  insideMenu?: boolean;
}
export default function Calculators({ insideMenu }: CalculatorsProps) {
  return (
    <div className="w-full flex flex-wrap items-start justify-around">
      <Link href={ROUTES.CALCULATE}>
        <a>
          <Section
            titleSVG={<SVGScale disabled={false} selected />}
            title="Buy v/s Rent"
            left={
              <ul>
                <li className="flex items-center">
                  <SVGBalance />
                  <span className="ml-1 mb-1">Which is Cheaper?</span>
                </li>
                <li className="flex items-center">
                  <SVGHourGlass />
                  <span className="ml-1 mb-1">For how many Years?</span>
                </li>
              </ul>
            }
            insideForm
            insideMenu={insideMenu}
            videoSrc={`https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`}
          />
        </a>
      </Link>
      <Link href={ROUTES.CALCULATE}>
        <a>
          <Section
            title="Financial Freedom"
            titleSVG={<SVGFreedom />}
            left={
              <ul>
                <li className="flex items-center">
                  <SVGPiggy disabled={false} selected />
                  <span className="ml-1 mb-1">How Much Money?</span>
                </li>
                <li className="flex items-center">
                  <SVGHourGlass />
                  <span className="ml-1 mb-1">By When?</span>
                </li>
              </ul>
            }
            insideForm
            insideMenu={insideMenu}
            videoSrc={`https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`}
          />
        </a>
      </Link>
    </div>
  );
}
