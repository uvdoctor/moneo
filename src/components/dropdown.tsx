import React from "react";

interface DropdownProps {
  topMargin?: number;
  options: any;
}
export default function Dropdown({
  topMargin,
  options,
}: DropdownProps) {
  return (
    <ul
      className={`${!topMargin && 'w-full flex flex-col justify-end items-end left-0'} z-50 px-2 md:px-4 absolute shadow-xl bg-white`}
      style={{
        marginTop: topMargin ? topMargin - 6.5 + "rem" : "",
      }}
    >
      {Object.keys(options).map((key, i) => 
        <a href={options[key]}>
          <li className={`${i !== 0 && 'pt-1'} whitespace-no-wrap hover:text-green-primary`}>{key}</li>
      </a>
      )}
    </ul>
  );
}
