import React from "react";
import Logo from "./logo";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";

export default function LogoWithName() {
  const fsb = useFullScreenBrowser();
  return (
    <div className="flex">
      <Logo />
      {!isMobileDevice(fsb) && <label className="text-base md:text-3xl mt-1">ollarDarwin</label>}
    </div>
  );
}
