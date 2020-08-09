import React from "react";

interface TabsProps {
  activeTab: number;
  tabs: Array<{
    label: string;
    nextStepIndex: number;
  }>;
  changeHandler: Function;
}

const selectedClass = "text-blue-700 border-l border-t border-r rounded-t";
const unSelectedClass = "text-blue-500 hover:text-blue-800";

const Tabs = ({ activeTab, changeHandler, tabs }: TabsProps) => {
  return (
    <ul className="flex border-b w-full">
      {tabs &&
        tabs.map((tab, index) => (
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block  py-2 px-4 font-semibold ${
                activeTab === index ? selectedClass : unSelectedClass
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                changeHandler(index, tab.nextStepIndex);
              }}
            >
              {tab.label}
            </a>
          </li>
        ))}
    </ul>
  );
};

export default Tabs;
