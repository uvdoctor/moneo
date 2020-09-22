import React from "react";
import Logo from "./logo";

export default function LogoWithName() {
  return (
    <div className="flex items-end">
      <div className="w-full text-bold flex items-center text-default">
        <Logo />
        <h1 className="mr-4 text-xl md:text-2xl lg:text-3xl">$Darwin</h1>
      </div>
      {/*<h3 className="whitespace-no-wrap">Your Analyst</h3>*/}
    </div>
  );
}
