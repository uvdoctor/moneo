import React, { ReactNode } from "react";
import LeftArrow from "./leftArrow";
import RightArrow from "./rightArrow";

interface SliderProps {
  totalItems: Array<any>;
  currentItem: string;
  children: ReactNode;
  setSlide: Function;
}

export default function SliderComponent({
  totalItems,
  currentItem,
  children,
  setSlide,
}: SliderProps) {
  const getOrder = (label: string) => {
    for (let i in totalItems) {
      if (totalItems[i].label === label) return totalItems[i].order;
    }
  };

  const currentItemOrder = getOrder(currentItem);
  const activeSlides = totalItems.filter((item) => item.active);

  const getNextItemLabel = (order: number) => {
    for (let i = 0; i < activeSlides.length; i++) {
      if (activeSlides[i].order === order) {
        return activeSlides[i + 1].label;
      }
    }
  };

  const getPrevItemLabel = (order: number) => {
    for (let i = 0; i < activeSlides.length; i++) {
      if (activeSlides[i].order === order) {
        return activeSlides[i - 1].label;
      }
    }
  };

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ minHeight: "500px" }}
    >
      {activeSlides.length > 1 && currentItemOrder !== 1 ? (
        <LeftArrow
          svgClasses="w-10"
          style={{ top: "48%" }}
          className="absolute left-0 z-10"
          clickHandler={() => {
            setSlide(getPrevItemLabel(currentItemOrder));
          }}
        />
      ) : null}
      <div
        className="absolute transition-left duration-1000 ease-in-out"
        style={{
          width: `${activeSlides.length * 100}%`,
          left: `-${(currentItemOrder - 1) * 100}%`,
        }}
      >
        {React.Children.map(children, (child: any) => (
          <div
            style={{
              width: `${100 / activeSlides.length}%`
            }}
            className="inline-block"
          >
            {child}
          </div>
        ))}
      </div>
      {activeSlides.length > 1 && currentItemOrder !== activeSlides.length ? (
        <RightArrow
          svgClasses="w-10"
          style={{ top: "48%" }}
          className="absolute right-0 z-10"
          clickHandler={() => {
            setSlide(getNextItemLabel(currentItemOrder));
          }}
        />
      ) : null}
    </div>
  );
}
