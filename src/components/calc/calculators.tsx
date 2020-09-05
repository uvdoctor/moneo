import React from "react";
import Section from "../form/section";
import SVGHourGlass from "../svghourglass";
import SVGScale from "../svgscale";
import Link from "next/link";
import { ROUTES } from "../../CONSTANTS";
import SVGBalance from "./svgbalance";

interface CalculatorsProps {
  insideMenu?: boolean
}
export default function Calculators({insideMenu}: CalculatorsProps) {
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
                  Which is Cheaper? For how many Years?
                </li>
              </ul>
            }
            insideForm
            insideMenu={insideMenu} 
          />
        </a>
      </Link>
      <Section
        title="Financial Freedom"
        left={
          <div>
            <SVGHourGlass />
            Financial Freedom
          </div>
        }
        insideForm
        insideMenu={insideMenu}
      />
    </div>
  );
}
