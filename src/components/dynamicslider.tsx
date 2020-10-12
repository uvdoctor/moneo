import React, { ReactNode } from "react";
import LeftArrow from "./leftArrow";
import RightArrow from "./rightArrow";
import {useFullScreenBrowser} from "react-browser-hooks"
interface DynamicSliderProps {
  totalItems: Array<any>;
  currentItem: string;
  children: ReactNode;
  setSlide: Function;
}

export default function DynamicSlider({
  totalItems,
  currentItem,
  children,
  setSlide,
}: DynamicSliderProps) {
  const fsb = useFullScreenBrowser()
  const getOrder = (label: string) => {
    for (let i in totalItems) {
      if (totalItems[i].label === label) return totalItems[i].order;
    }
  };

  const currentItemOrder = getOrder(currentItem);
  const activeSlides = totalItems.filter((item) => item.active)

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
      style={{ minHeight: fsb.info.innerHeight+"px", position: 'relative', width: '100%' }}
    >
      {activeSlides.length > 1 && currentItemOrder !== 1 ? (
        <LeftArrow
          svgClasses="w-10"
          style={{ top: "48%", position: 'absolute', left: 0, zIndex: 10 }}
          clickHandler={() => {
            setSlide(getPrevItemLabel(currentItemOrder));
          }}
        />
      ) : null}
      <div
        style={{
          width: `${activeSlides.length * 100}%`,
          left: `-${(currentItemOrder - 1) * 100}%`,
          position: 'absolute'
        }}
      >
        {React.Children.map(children, (child: any) => (
          <div
            style={{
              display: 'inline-block',
              width: `${100 / activeSlides.length}%`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
      {activeSlides.length > 1 && currentItemOrder !== activeSlides.length ? (
        <RightArrow
          svgClasses="w-10"
          style={{ top: "48%", position: 'absolute', right: 0, zIndex: 10 }}
          clickHandler={() => {
            setSlide(getNextItemLabel(currentItemOrder));
          }}
        />
      ) : null}
    </div>
  );
}
