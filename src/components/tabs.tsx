import React, { useEffect, useState } from "react";

interface TabsProps {
  tabs: Array<any>;
  selectedTab: string;
  customStyle?: string;
  capacity: number;
  currentOrder: number;
  allInputDone: boolean;
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
  };

  //@ts-ignore
  const currentStyle = props.customStyle
    ? styleMap[props.customStyle]
    : styleMap["standard"];

  const [endIndex, setEndIndex] = useState<number>(props.capacity - 1);

  const handleDecrement = () => setEndIndex(endIndex - 1);

  const handleIncrement = () => setEndIndex(endIndex + 1);

  useEffect(() => {
    if (props.allInputDone) setEndIndex(props.tabs.length - 1);
  }, [props.allInputDone]);

  const isLinkDisabled = (tab: any) => {
    if (props.allInputDone && tab.active) return false;
    return tab.enableOrder > props.currentOrder;
  };

  return (
    <div className="w-full flex items-center">
      {props.allInputDone && props.tabs.length > props.capacity && (
        <div className="w-1/12 ml-4 md:ml-8 text-xl">
          {endIndex > props.capacity - 1 ? (
            <label
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
              onClick={handleDecrement}
            >{`<<`}</label>
          ) : (
            <label className="text-gray-400 cursor-not-allowed">{`<<`}</label>
          )}
        </div>
      )}
      <ul
        className={`flex justify-center w-10/12 ${
          !props.allInputDone && "flex-wrap"
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
              className={`${
                isLinkDisabled(tab)
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer font-semibold"
              } py-2 px-4 items-start 
                    ${
                      props.selectedTab === tab.label
                        ? `${currentStyle.selected.text} ${currentStyle.selected.background} rounded-b rounded-t`
                        : !isLinkDisabled(tab)
                        ? `${currentStyle.unselected.text} ${currentStyle.unselected.background} 
                          hover:${currentStyle.unselected.hover}`
                        : ""
                    }
                    `}
              onClick={(e: any) =>
                !isLinkDisabled(tab) &&
                props.selectedTabHandler(e.target.innerText)
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
            <label
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
              onClick={handleIncrement}
            >{`>>`}</label>
          ) : (
            <label className="text-gray-400 cursor-not-allowed">{`>>`}</label>
          )}
        </div>
      )}
    </div>
  );
}
