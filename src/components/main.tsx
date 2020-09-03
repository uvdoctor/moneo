import React, { useEffect, useState } from "react";
import Features from "./features/features";
import Landing from "./landing";
import { useScroll, useFullScreenBrowser } from "react-browser-hooks";
import Header from "./header";
export default function Main() {
  const { top } = useScroll();
  const fsb = useFullScreenBrowser();
  const [landingHeight, setLandingHeight] = useState<number>(
    (fsb.info.screenWidth * 3) / 5
  );

  useEffect(() => {
    setLandingHeight(Math.round((fsb.info.innerWidth * 3) / 5));
  }, [fsb.info.innerWidth]);

  return (
    <div className="overflow-x-none overflow-y-auto">
      {top > landingHeight && <Header />}
      <Landing />
      <Features />
    </div>
  );
}
