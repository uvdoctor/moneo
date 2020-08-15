import React from "react";
import SVGLeft from "./svgleft";

interface LeftArrowProps {
  clickHandler: () => void;
  className?: string;
  svgClasses?: string;
  style?: object;
}

export default function LeftArrow({
  className,
  clickHandler,
  svgClasses,
  style,
}: LeftArrowProps) {
  return (
    <div
      className={`transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${className}`}
      style={style}
      onClick={clickHandler}
    >
      <SVGLeft className={svgClasses} />
    </div>
  );
}
