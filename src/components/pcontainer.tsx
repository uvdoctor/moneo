import React, { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";
import dynamic from "next/dynamic";

interface PContainerProps {
  children: React.ReactNode;
  format: string;
  y: Array<number>;
}

const PCache = dynamic(() => import("./pcache"), { ssr: false });

export default function PContainer({ children, format, y }: PContainerProps) {
  const [isMobile, setIsMobile] = useState(true);
  const fsb = useFullScreenBrowser();

  useEffect(
    function () {
      setIsMobile(isMobileDevice(fsb));
    },
    [null]
  );

  return !isMobile ? (
    <Parallax className={format} y={y} tagOuter="figure">
      <PCache />
      {children}
    </Parallax>
  ) : (
    <div className={format}>{children}</div>
  );
}
