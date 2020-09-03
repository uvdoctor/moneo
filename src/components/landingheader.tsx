import React from "react";
import Logo from "./logo";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import { COLORS } from "../CONSTANTS";
import Menu from "./menu";
const LandingHeader = () => {
  return (
    <nav
      className="md:text-lg lg:text-xl flex w-full items-end justify-between flex-wrap py-1 cursor font-bold"
      style={{ color: COLORS.SILVER }}
    >
      <Logo />
      <Menu transparent />
    </nav>
  );
};

export default LandingHeader;
