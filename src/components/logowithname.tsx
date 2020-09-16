import React from "react";
import Logo from "./logo";

export default function LogoWithName() {
  return (
    <div className="w-full text-bold flex items-end text-default">
      <Logo />
      <h1 className="mr-4">$Darwin</h1>
      <h3 className="whitespace-no-wrap">Your Analyst</h3>
    </div>
  );
}
