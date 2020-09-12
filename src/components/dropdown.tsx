import React from "react";

interface DropdownProps {
  parentStyleDiff?: boolean;
  topMargin?: number;
  options: any;
}
export default function Dropdown({
  parentStyleDiff,
  topMargin,
  options,
}: DropdownProps) {
  return (
    <ul
      className={`${!topMargin && 'w-full flex flex-col justify-center items-center left-0'} z-50 px-2 md:px-4 absolute shadow-xl`}
      style={{
        marginTop: topMargin ? topMargin - 6 + "rem" : "",
        backgroundColor: parentStyleDiff ? "#94ca5d" : "white",
      }}
    >
      {Object.keys(options).map((key, i) => 
        <a href={options[key]}>
          <li className={`${i === 0 && 'py-1'} whitespace-no-wrap hover:text-green-primary`}>{key}</li>
      </a>
      )}
    </ul>
  );
}
