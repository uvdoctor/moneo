import React, { useEffect, useState } from "react";
import LeftArrow from "./leftArrow";
import RightArrow from "./rightArrow";

interface TabsProps {
  tabs: Array<any>;
  selectedTab: string | number;
  customStyle?: string;
  capacity: number;
  currentOrder?: number;
  allInputDone?: boolean;
  selectedTabHandler: Function;
  keepCentered?: boolean;
}

export const DASHBOARD_STYLE = "dashboard";

export default function Tabs(props: TabsProps) {
  const styleMap: any = {
    [DASHBOARD_STYLE]: {
      parent: "mt-12 py-1 bg-black justify-center text-base",
      current: "pt-2 px-4 md:px-8",
      selected: {
        text: "text-green-600",
      },
      unselected: {
        text: "text-white",
        hover: "text-green-600",
      },
    },
    standard: {
      parent: `w-full text-sm md:text-base ${!props.allInputDone || props.keepCentered ? 'justify-center' : 'mr-0 justify-around'}`,
      current: `${(!props.allInputDone || props.keepCentered) && 'mr-2 md:mr-4'}`,
      selected: {
        text: "text-blue-600",
      },
      unselected: {
        text: "text-gray-800",
        hover: "text-blue-600",
      },
    },
  };

  //@ts-ignore
  const currentStyle = props.customStyle
    ? styleMap[props.customStyle]
    : styleMap["standard"];

  const [endIndex, setEndIndex] = useState<number>(props.capacity - 1);

  const handleDecrement = () => setEndIndex(endIndex - 1);

  const handleIncrement = () => setEndIndex(endIndex + 1);

  const [endIndexOnLoad, setEndIndexOnLoad] = useState<number>(endIndex);

  useEffect(() => {
    if (!props.allInputDone) setEndIndexOnLoad(props.tabs.length - 1);
  }, []);

  useEffect(() => {
    if (props.allInputDone) setEndIndex(endIndexOnLoad);
  }, [props.allInputDone]);

  useEffect(() => {
    setEndIndex(props.capacity - 1);
  }, [props.capacity]);

  useEffect(() => {
    let selectedIndex = 0;
    props.tabs.filter((tab, i) => {
      if (tab.label === props.selectedTab) {
        selectedIndex = i;
      }
    });
    if (selectedIndex <= endIndex && endIndex - selectedIndex < props.capacity)
      return;
    if (selectedIndex > endIndex) {
      setEndIndex(selectedIndex);
    } else setEndIndex(selectedIndex + props.capacity - 1);
  }, [props.selectedTab]);

  const isLinkDisabled = (tab: any) => {
    if (!tab.active) return true;
    if (!props.allInputDone) {
      if (!props.currentOrder) return false;
      return tab.order > props.currentOrder;
    }
    return false;
  };

  return (
    <div className="w-full flex items-center">
      {props.allInputDone &&
        props.tabs.length > props.capacity &&
        endIndex > props.capacity - 1 && (
          <LeftArrow clickHandler={handleDecrement} />
        )}
      <div
        className={`flex w-full ${!props.allInputDone && "flex-wrap"} ${
          currentStyle.parent
        }`}
      >
        {props.tabs.map((tab, i) => {
          if (props.allInputDone) {
            if (i > endIndex) return;
            if (Math.abs(endIndex - i) >= props.capacity) return;
          }
          return (
            <div
              key={"tab" + i}
              className={`items-start ${currentStyle.current}
                    ${
                      props.selectedTab === tab.label
                        ? `${currentStyle.selected.text} font-semibold`
                        : !isLinkDisabled(tab)
                        ? `${currentStyle.unselected.text}  
                          cursor-pointer font-semibold hover:${currentStyle.unselected.hover}`
                        : "cursor-not-allowed text-gray-400"
                    }
                    `}
              onClick={() =>
                !isLinkDisabled(tab) && props.selectedTabHandler(tab.label)
              }
            >
              <div className="w-full flex flex-col justify-center items-center">
                {tab.svg && (
                  <div className="flex justify-center items-center">
                    <tab.svg
                      disabled={isLinkDisabled(tab)}
                      selected={props.selectedTab === tab.label}
                    />
                    {tab.svglabel && <span className="ml-1">{tab.svglabel}</span>}
                  </div>
                )}
                {tab.label}
              </div>
            </div>
          );
        })}
      </div>
      {props.allInputDone &&
        props.tabs.length > props.capacity &&
        endIndex >= props.capacity - 1 &&
        endIndex < props.tabs.length - 1 && (
          <RightArrow clickHandler={handleIncrement} />
        )}
    </div>
  );
}
