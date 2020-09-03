import React, { useEffect, useState } from "react";
import Features from "./features/features";
import Landing from "./landing";
import { useScroll, useFullScreenBrowser } from "react-browser-hooks";
import Header from "./header";
import { getLandingPageHeight } from "./utils";
export default function Main() {
  const { top } = useScroll();
  const fsb = useFullScreenBrowser();
  const [landingHeight, setLandingHeight] = useState<number>(
    getLandingPageHeight(fsb)
  );

  useEffect(() => {
    setLandingHeight(getLandingPageHeight(fsb));
  }, [fsb.info.innerWidth]);

  return (
    <div className="overflow-x-none overflow-y-auto">
      {top > landingHeight && <Header />}
      <Landing />
      <Features />
    </div>
  );
}
