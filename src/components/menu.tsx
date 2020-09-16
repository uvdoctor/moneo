import Link from "next/link";
import React from "react";
import { HOME_ANCHORS, ROUTES } from "../CONSTANTS";
import Calculators from "./calc/calculators";
import ExpandCollapse from "./form/expandcollapse";
import Dropdown from "./dropdown";
interface MenuProps {
  parentStyleDiffHandler?: Function;
}

export default function Menu({ parentStyleDiffHandler }: MenuProps) {
  const topMargin = 14.5;

  return (
    <div className="max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg w-full flex items-center justify-between">
      <Link href={ROUTES.CALCULATE}>
        <a>
          <div className="w-full">
            <ExpandCollapse
              title="Calculate"
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
      <div className="xl:mr-24">
        <ExpandCollapse title="About">
          <Dropdown
            topMargin={topMargin}
            options={{
              Features: HOME_ANCHORS.FEATURES,
              Pricing: HOME_ANCHORS.PRICE,
              Company: HOME_ANCHORS.COMPANY,
            }}
          />
        </ExpandCollapse>
      </div>
      <div className="hover:text-green-primary mr-2 md:mr-4 lg:mr-8 whitespace-no-wrap">
        <a href={HOME_ANCHORS.JOIN}>Join Waitlist</a>
      </div>
    </div>
  );
}
