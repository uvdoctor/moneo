import Link from "next/link";
import React from "react";
import { ROUTES } from "../CONSTANTS";
import Calculators from "./calc/calculators";
import ExpandCollapse from "./form/expandcollapse";
import Dropdown from "./dropdown";
interface MenuProps {
  parentStyleDiff?: boolean;
  parentStyleDiffHandler?: Function;
  topMargin: number
}

export default function Menu({
  parentStyleDiff,
  parentStyleDiffHandler,
  topMargin
}: MenuProps) {
  return (
    <div className="max-w-xs md:max-w-sm lg:max-w-md w-full flex items-center justify-between">
      <Link href={ROUTES.CALCULATE}>
        <a>
          <div className="hover:text-green-primary w-full">
            <ExpandCollapse
              title="Calculate"
              coverPage={parentStyleDiff}
              animate
              parentStyleDiffHandler={parentStyleDiffHandler}
            >
              <div
                className="w-full text-default absolute left-0 z-50 bg-white"
                style={{ marginTop: topMargin + "rem" }}
              >
                <Calculators insideMenu />
              </div>
            </ExpandCollapse>
          </div>
        </a>
      </Link>
      {/*<div className="hover:text-green-primary">
              <Link href="#">
                <a>Learn</a>
              </Link>
  </div>*/}
      <ExpandCollapse title="About" coverPage={parentStyleDiff}>
        <Dropdown
          parentStyleDiff={parentStyleDiff}
          topMargin={topMargin}
          options={{
            Features: "#features",
            Price: "#price",
            Company: "#company",
          }}
        />
      </ExpandCollapse>
      <div className="hover:text-green-primary mr-2 md:mr-4 lg:mr-8 whitespace-no-wrap">
        <a href="#join">Join Waitlist</a>
      </div>
    </div>
  );
}
