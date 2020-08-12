import React, { useState } from "react";

interface TabsProps {
  tabs: Array<string>;
  selectedTab: string;
  customStyle?: string;
  capacity: number;
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
      },
    },
    standard: {
      selected: {
        background: "bg-white",
        text: "text-blue-800",
      },
      unselected: {
        background: "bg-white",
        text: "text-blue-600",
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

  return (
    <div className="flex">
      <ul
        className={`flex overflow-none cursor-pointer ${currentStyle.unselected.text} ${currentStyle.unselected.background}`}
      >
        {props.tabs.map((tab, i) => {
          if(props.allInputDone && (i > endIndex || i <= endIndex - props.capacity)) return
          return (
            <li
              key={"tab" + i}
              className={`-mb-px mr-1 py-2 px-4 items-start hover:${
                currentStyle.selected.text
              } font-semibold
                    ${
                      props.selectedTab === tab
                        ? `border-t border-l border-r ${currentStyle.selected.text} ${currentStyle.selected.background} rounded-t`
                        : "border-b"
                    }`}
              onClick={(e: any) => props.selectedTabHandler(e.target.innerText)}
            >
              {tab}
            </li>
          );
        })}
      </ul>
      {props.allInputDone && props.tabs.length > props.capacity && (
        <ul className="w-full flex items-center justify-end mr-4 md:mr-8">
          {endIndex > props.capacity - 1 ? (
            <li
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={handleDecrement}
            >{`<`}</li>
          ) : (
            <label className="text-gray-400">{`<`}</label>
          )}
          {endIndex >= props.capacity - 1 &&
          endIndex < props.tabs.length - 1 ? (
            <li
              className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={handleIncrement}
            >{`>`}</li>
          ) : (
            <label className="ml-2 text-gray-400">{`>`}</label>
          )}
        </ul>
      )}
    </div>
  );
}
