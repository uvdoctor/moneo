import Link from "next/link";
import React from "react";
import { COLORS, ROUTES } from "../CONSTANTS";
import ExpandCollapse from "./form/expandcollapse";

interface MenuProps {
  fixed?: boolean
}

export default function Menu({fixed}: MenuProps) {
  return (
    <div className="w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 flex justify-between">
      <div className="w-full flex justify-around">
        <div className="flex flex-col relative">
          <ExpandCollapse
            title="About"
            hoverColor="text-green-primary"
            defaultSVGColor={fixed ? COLORS.DEFAULT : COLORS.SILVER}
            hoverSVGColor={COLORS.GREEN}
          >
            <ul
              className={`${fixed && 'bg-white'} mt-32 pt-8 px-2 md:px-4 py-1 absolute shadow-xl`}
            >
              <li className="py-1 hover:text-green-primary">Features</li>
              <li className="py-1 hover:text-green-primary">Price</li>
              <li className="py-1 hover:text-green-primary">Company</li>
            </ul>
          </ExpandCollapse>
        </div>
        <div className="hover:text-green-primary">
          <Link href="#">
            <a>Learn</a>
          </Link>
        </div>
        <div className="hover:text-green-primary">
          <Link href={ROUTES.CALCULATE}>
            <a>Calculate</a>
          </Link>
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
