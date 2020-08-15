import React, { ReactNode } from "react";
import LeftArrow from "./leftArrow";
import RightArrow from "./rightArrow";

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
      { currentItem !== 1 ? 
      <LeftArrow svgClasses="w-10" style={{ top: "48%" }} className="absolute left-0 z-10" clickHandler={() => {
        setSlide(currentItem - 1);
      }} />
       : null}
      <div
        className="absolute transition-left duration-1000 ease-in-out"
        style={{
          width: `${totalItems * 100}%`,
          left: `-${(currentItem - 1) * 100}%`,
        }}
      >
        {children}
      </div>
      {currentItem !== totalItems ? 
      <RightArrow svgClasses="w-10" style={{ top: "48%" }} className="absolute right-0 z-10" clickHandler={() => {
        setSlide(currentItem + 1);
      }} />: null}
    </div>
  );
}
