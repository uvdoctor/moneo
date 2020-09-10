import React from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";
import LogoWithName from "./logowithname";

const Header = () => {
  return (
    <nav
      className="fixed top-0 bg-white md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap py-1 cursor font-bold z-10">
      <LogoWithName />
      <Menu />
    </nav>
  );
};

export default Header;
