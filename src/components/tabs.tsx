import React from "react";

interface TabsProps {
  activeTab: number;
  tabs: Array<{
    label: string,
    nextStepIndex: number,
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
      {/* <li className="-mb-px mr-1">
        <a
          className="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
          href="#"
        >
          Goal Details
        </a>
      </li>
      <li className="mr-1">
        <a
          className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
          href="#"
        >
          Sell After
        </a>
      </li>
      <li className="mr-1">
        <a
          className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
          href="#"
        >
          Tab
        </a>
      </li>
      <li className="mr-1">
        <a
          className="bg-white inline-block py-2 px-4 text-gray-400 font-semibold"
          href="#"
        >
          Tab
        </a>
      </li> */}
    </ul>
  );
};

export default Tabs;
