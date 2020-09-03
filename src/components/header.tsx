import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { ROUTES } from "../CONSTANTS";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";

const Header = () => {
  return (
    <nav className="md:text-lg lg:text-xl fixed flex w-full bg-white items-end justify-between flex-wrap py-1 top-0 cursor font-bold z-10">
      <Logo />
        <div className="w-2/3 md:w-1/2 flex justify-around">
          <div className="hoverable relative inline-block hover:text-green-primary cursor">
            <label>About</label>
            <ul className="px-2 md:px-4 py-1 dropdown-menu absolute shadow-xl text-white font-normal text-base md:text-lg">
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
        <div className="hover:text-green-primary mr-2 md:mr-4">
          <Link href={ROUTES.DASHBOARD}>
            <a>Login</a>
          </Link>
        </div>
    </nav>
  );
};

export default Header;
