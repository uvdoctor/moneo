import React from "react";
import Logo from "./logo";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import Menu from "./menu";

const Header = () => {
  return (
    <nav
      className="fixed top-0 bg-green-100 md:text-lg lg:text-xl flex w-full items-end 
      justify-between flex-wrap py-1 cursor font-bold z-10">
      <Logo />
      <Menu />
    </nav>
  );
};

export default Header;
