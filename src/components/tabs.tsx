import React, { useEffect, useState } from "react";
import SVGLeft from "./svgleft";
import SVGRight from "./svgright";
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
      selected: {
        background: "bg-blue-600",
        text: "text-white",
      },
      unselected: {
        background: "bg-white",
        text: "text-blue-600",
        hover: "text-blue-800",
      },
    },
    resultTab: {
      parent: "w-full justify-end",
      selected: {
        background: "bg-blue-600",
        text: "text-white",
      },
      unselected: {
        background: "bg-white",
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

  const [endIndexOnLoad, setEndIndexOnLoad] = useState<number>(endIndex)

  useEffect(() => {
    if(!props.allInputDone) setEndIndexOnLoad(props.tabs.length - 1)
  }, [])

  useEffect(() => {
    if (props.allInputDone) setEndIndex(endIndexOnLoad);
  }, [props.allInputDone]);

  const isLinkDisabled = (tab: any) => {
    if (props.allInputDone && tab.active) return false;
    if (!props.currentOrder) {
      return false;
    }
    return tab.enableOrder > props.currentOrder;
  };

  return (
    <div className="w-full flex items-center">
      {props.allInputDone && props.tabs.length > props.capacity && (
        <div className="w-1/12 ml-4 md:ml-8">
          {endIndex > props.capacity - 1 ? (
            <div onClick={handleDecrement}>
              <SVGLeft />
            </div>
          ) : (
            <SVGLeft disable />
          )}
        </div>
      )}
      <ul
        className={`flex  ${
          !props.allInputDone && "flex-wrap"
        } ${currentStyle.parent || 'w-10/12 justify-center'}` }
      >
        {props.tabs.map((tab, i) => {
          if (props.allInputDone) {
            if (i > endIndex) return;
            if (Math.abs(endIndex - i) >= props.capacity) return;
          }
          const code = tab.code || tab.label;
          return (
            <li
              key={"tab" + i}
              className={`${
                isLinkDisabled(tab)
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer font-semibold"
              } py-2 px-4 items-start 
                    ${
                      props.selectedTab === code
                        ? `${currentStyle.selected.text} ${currentStyle.selected.background} rounded-b rounded-t`
                        : !isLinkDisabled(tab)
                        ? `${currentStyle.unselected.text} ${currentStyle.unselected.background} 
                          hover:${currentStyle.unselected.hover}`
                        : ""
                    }
                    `}
              onClick={() =>
                !isLinkDisabled(tab) &&
                props.selectedTabHandler(code)
              }
            >
              {tab.label}
            </li>
          );
        })}
      </ul>
      {props.allInputDone && props.tabs.length > props.capacity && (
        <div className="w-1/12 mr-4 md:mr-8 text-xl">
          {endIndex >= props.capacity - 1 &&
          endIndex < props.tabs.length - 1 ? (
            <div onClick={handleIncrement}>
              <SVGRight />
            </div>
          ) : (
            <SVGRight disable />
          )}
        </div>
      )}
    </div>
  );
}
