import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { ROUTES } from "../CONSTANTS";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";

const Header = () => {
  return (
    <nav className="w-1/6 md:text-lg lg:text-xl fixed flex w-full bg-white items-center justify-between flex-wrap py-1 top-0 cursor font-bold">
      <Logo />
      <div className="w-5/6 flex items-center justify-around">
        <div className="hoverable relative inline-block hover:text-green-600 cursor">
          <label>About</label>
          <ul className="px-2 md:px-4 py-1 dropdown-menu absolute shadow-xl bg-green-600 text-white font-normal text-base md:text-lg">
            <li className="py-1 hover:text-black">Features</li>
            <li className="py-1 hover:text-black">Price</li>
            <li className="py-1 hover:text-black">Company</li>
          </ul>
        </div>
        <div className="hover:text-green-600">
          <Link href="#">
            <a>Learn</a>
          </Link>
        </div>
        <div className="hover:text-green-600">
          <Link href={ROUTES.CALCULATE}>
            <a>Calculate</a>
          </Link>
        </div>
        <div className="hover:text-green-600">
          <Link href={ROUTES.DASHBOARD}>
            <a>Login</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
