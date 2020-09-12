import React from "react";
import { COLORS } from "../CONSTANTS";

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
      className={`${!topMargin && 'w-full flex flex-col justify-end items-end left-0'} z-50 px-2 md:px-4 absolute shadow-xl`}
      style={{
        marginTop: topMargin ? topMargin - 6.5 + "rem" : "",
        backgroundColor: parentStyleDiff ? "#94ca5d" : "white",
        backgroundImage: topMargin ? "" : `linear-gradient(to right, ${COLORS.SILVER}, ${
          parentStyleDiff ? "#7dc13a" : "white"
        })`,
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
