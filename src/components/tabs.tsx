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
  bottomRounded?: boolean;
}

export const DASHBOARD_STYLE = "dashboard";

export default function Tabs(props: TabsProps) {
  const styleMap: any = {
    [DASHBOARD_STYLE]: {
      parent: "mt-12 py-1 bg-black",
      selected: {
        background: "pt-2 px-4",
        text: "text-green-600",
      },
      unselected: {
        background: "pt-2 px-4",
        text: "text-white",
        hover: "text-green-600",
      },
    },
    standard: {
      parent: "text-base justify-center",
      selected: {
        background: "",
        text: "text-blue-600",
      },
      unselected: {
        background: "",
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
              className={`mr-2 items-start 
                    ${
                      props.selectedTab === tab.label
                        ? `${currentStyle.selected.text} ${currentStyle.selected.background} font-semibold`
                        : !isLinkDisabled(tab)
                        ? `${currentStyle.unselected.text} ${currentStyle.unselected.background} 
                          cursor-pointer font-semibold hover:${currentStyle.unselected.hover}`
                        : "cursor-not-allowed text-gray-400"
                    }
                    `}
              onClick={() =>
                !isLinkDisabled(tab) && props.selectedTabHandler(tab.label)
              }
            >
              <div className="flex flex-col items-center">
                {tab.svg && (
                  <div className="flex items-center">
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
