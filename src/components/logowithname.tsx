import React from "react";
import Logo from "./logo";

export default function LogoWithName() {
  return (
    <div className="flex">
      <Logo />
      <h1 className="text-base md:text-3xl mt-2 text-default">$Darwin</h1>
    </div>
  );
}
