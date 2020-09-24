import React from "react";
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
  const fsb = useFullScreenBrowser();
  
  return !isMobileDevice(fsb) ? (
    <Parallax className={format} y={y} tagOuter="figure">
      <PCache />
      {children}
    </Parallax>
  ) : (
    <div className={format}>{children}</div>
  );
};
