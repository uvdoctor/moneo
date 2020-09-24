import React from "react";
import { Parallax } from "react-scroll-parallax";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";
import ParallaxCache from "./pcache";

interface PContainerProps {
  children: React.ReactNode;
  format: string;
  y: Array<number>;
}


export default function PContainer({ children, format, y }: PContainerProps) {
  const fsb = useFullScreenBrowser();
  
  return !isMobileDevice(fsb) ? (
    <Parallax className={format} y={y} tagOuter="figure">
      <ParallaxCache />
      {children}
    </Parallax>
  ) : (
    <div className={format}>{children}</div>
  );
};
