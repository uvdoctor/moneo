import React from "react";
import SVGRight from "./svgright";

interface RightArrowProps {
  clickHandler: () => void;
  className?: string;
  svgClasses?: string;
  style?: object;
}

export default function RightArrow({
  className,
  clickHandler,
  svgClasses,
  style,
}: RightArrowProps) {
  return (
    <div
      className={`transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${className}`}
      style={style}
      onClick={clickHandler}
    >
      <SVGRight className={svgClasses} />
    </div>
  );
}
