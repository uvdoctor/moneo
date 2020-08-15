import React, { ReactNode } from "react";
import SVGLeft from "./svgleft";
import SVGRight from "./svgright";

interface SliderProps {
  totalItems: number;
  currentItem: number;
  children: ReactNode;
  setSlide: Function;
}

export default function SliderComponent({
  totalItems,
  currentItem,
  children,
  setSlide,
}: SliderProps) {
  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ minHeight: "500px" }}
    >
      { currentItem !== 1 ? <div
        className="absolute left-0 z-10 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        style={{ top: "48%" }}
        onClick={() => {
          setSlide(currentItem - 1);
        }}
      >
        <SVGLeft className="w-10" disable={currentItem === 1} />
      </div> : null}
      <div
        className="absolute transition-left duration-1000 ease-in-out"
        style={{
          width: `${totalItems * 100}%`,
          left: `-${(currentItem - 1) * 100}%`,
        }}
      >
        {children}
      </div>
      {currentItem !== totalItems ? <div
        className="absolute right-0 z-10 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        style={{ top: "48%" }}
        onClick={() => {
          setSlide(currentItem + 1);
        }}
      >
        <SVGRight className="w-10" disable={currentItem === totalItems} />
      </div>: null}
    </div>
  );
}
