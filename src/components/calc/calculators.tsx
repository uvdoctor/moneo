import React from "react";
import Section from "../form/section";
import SVGHourGlass from "../svghourglass";
import SVGScale from "../svgscale";
import Link from "next/link";
import { ROUTES } from "../../CONSTANTS";
import SVGBalance from "./svgbalance";

export default function Calculators() {
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
            insideMenu
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
      />
    </div>
  );
}
