import Link from "next/link";
import React, { Fragment } from "react";
import { ROUTES } from "../CONSTANTS";

interface MenuProps {
    transparent?: boolean
}

export default function Menu({transparent}: MenuProps) {
  return (
    <Fragment>
      <div className="w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 flex justify-between">
        <div className="hoverable relative inline-block hover:text-green-primary cursor">
          <label>About</label>
          <ul className={`px-2 md:px-4 py-1 dropdown-menu absolute shadow-xl ${transparent && 'text-white'} font-normal text-base md:text-lg`}>
            <li className="py-1 hover:text-black">Features</li>
            <li className="py-1 hover:text-black">Price</li>
            <li className="py-1 hover:text-black">Company</li>
          </ul>
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
      <div className="hover:text-green-primary mr-2 md:mr-4 lg:mr-8 xl:mr-16">
        <Link href={ROUTES.DASHBOARD}>
          <a>Login</a>
        </Link>
      </div>
    </Fragment>
  );
}
