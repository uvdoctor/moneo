import Link from "next/link";
import React from "react";
import { COLORS, ROUTES } from "../CONSTANTS";
import Calculators from "./calc/calculators";
import ExpandCollapse from "./form/expandcollapse";

interface MenuProps {
  coverPage?: boolean;
}

export default function Menu({ coverPage }: MenuProps) {
  return (
    <div className="w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 flex justify-between">
      <div className="w-full flex justify-around">
        <div className="hover:text-green-primary">
          <Link href={ROUTES.CALCULATE}>
            <a>
              <ExpandCollapse
                title="Calculate"
                defaultSVGColor={coverPage ? COLORS.DEFAULT : COLORS.SILVER}
                hoverSVGColor={COLORS.GREEN}
                animate
              >
                <div className="w-full text-default z-50 left-0 absolute mt-40 bg-white">
                  <Calculators insideMenu />
                </div>
              </ExpandCollapse>
            </a>
          </Link>
        </div>
        <div className="hover:text-green-primary">
          <Link href="#">
            <a>Learn</a>
          </Link>
        </div>
        <div className="flex flex-col relative">
          <ExpandCollapse
            title="About"
            defaultSVGColor={coverPage ? COLORS.DEFAULT : COLORS.SILVER}
            hoverSVGColor={COLORS.GREEN}
          >
            <ul
              className={`mt-32 z-50 ${
                coverPage ? "bg-white" : "pt-4"
              } px-2 md:px-4 absolute shadow-xl`}
            >
              <li className="py-1 hover:text-green-primary">Features</li>
              <li className="py-1 hover:text-green-primary">Price</li>
              <li className="py-1 hover:text-green-primary">Company</li>
            </ul>
          </ExpandCollapse>
        </div>
      </div>
      <div className="hover:text-green-primary mr-2 md:mr-4 lg:mr-8">
        <Link href={ROUTES.DASHBOARD}>
          <a>Login</a>
        </Link>
      </div>
    </div>
  );
}
