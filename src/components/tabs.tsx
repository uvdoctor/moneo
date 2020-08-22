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
}

export default function Tabs(props: TabsProps) {
  const styleMap: any = {
    dashboard: {
      parent: "w-10/12 justify-center",
      selected: {
        background: "bg-white",
        text: "text-green-600",
      },
      unselected: {
        background: "bg-black",
        text: "text-white",
        hover: "text-green-600",
      },
    },
    standard: {
      parent: "w-10/12 justify-center",
      selected: {
        background: "bg-blue-600",
        text: "text-white",
      },
      unselected: {
        background: "bg-gray-200",
        text: "text-blue-600",
        hover: "text-blue-800",
      },
    },
    resultTab: {
      parent: "w-full flex justify-end",
      selected: {
        background: "bg-blue-600",
        text: "text-white",
      },
      unselected: {
        background: "bg-gray-200",
        text: "text-blue-600",
        hover: "text-blue-800",
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

  const isLinkDisabled = (tab: any) => {
    if (props.allInputDone) return !tab.active;
    if (!props.currentOrder) {
      return false;
    }
    return tab.order > props.currentOrder;
  };

  return (
    <div className="w-full flex items-center">
      {props.allInputDone && props.tabs.length > props.capacity && (
        <div className="mr-2">
          {endIndex > props.capacity - 1 && (
            <LeftArrow clickHandler={handleDecrement} />
          )}
        </div>
      )}
      <ul
        className={`flex  ${!props.allInputDone && "flex-wrap w-full"} ${
          currentStyle.parent
        }`}
      >
        {props.tabs.map((tab, i) => {
          if (props.allInputDone) {
            if (i > endIndex) return;
            if (Math.abs(endIndex - i) >= props.capacity) return;
          }
          return (
            <li
              key={"tab" + i}
              className={`py-2 px-4 items-start 
                    ${
                      props.selectedTab === tab.label
                        ? `${currentStyle.selected.text} ${currentStyle.selected.background} font-semibold cursor-pointer rounded-b lg:rounded-b-none lg:rounded-t`
                        : !isLinkDisabled(tab)
                        ? `${currentStyle.unselected.text} ${currentStyle.unselected.background} 
                          cursor-pointer font-semibold shadow-lg lg:shadow-xl rounded-b lg:rounded-b-none lg:rounded-t hover:${currentStyle.unselected.hover}`
                        : "cursor-not-allowed text-gray-400"
                    }
                    `}
              onClick={() =>
                !isLinkDisabled(tab) && props.selectedTabHandler(tab.label)
              }
            >
              <div className="flex items-center">
                {console.log("Tab is ", tab)}
                {tab.svg && !isLinkDisabled(tab) && (
                  <div className="inline mr-1">{tab.svg}</div>
                )}
                {tab.label}
              </div>
            </li>
          );
        })}
      </ul>
      {props.allInputDone && props.tabs.length > props.capacity && (
        <div className="ml-2">
          {endIndex >= props.capacity - 1 &&
            endIndex < props.tabs.length - 1 && (
              <RightArrow clickHandler={handleIncrement} />
            )}
        </div>
      )}
    </div>
  );
}
