import React, { ReactNode, useState } from "react";
import SVGExpand from "../svgexpand";
import SVGCollapse from "../svgcollapse";
import SVGInfo from "../svginfo";
import { toast } from "react-toastify";
import { COLORS } from "../../CONSTANTS";
interface ExpandCollapseProps {
  title: string;
  titleInfo?: string;
  svg?: any;
  insideForm?: boolean;
  children: ReactNode;
  coverPage?: boolean;
  animate?: boolean;
  parentStyleDiffHandler?: Function | null;
}

export default function ExpandCollapse(props: ExpandCollapseProps) {
  const [show, setShow] = useState<boolean>(false);
  const toggle = () => {
    setShow(!show);
  };

  return (
    <div
      className={`w-full ${props.insideForm && "bg-gray-700 text-white py-1"}`}
    >
      {props.titleInfo && (
        <div
          className="w-full flex justify-center cursor-pointer"
          onClick={() => toast.info(props.titleInfo)}
        >
          <SVGInfo />
        </div>
      )}
      <div
        className="cursor-pointer flex flex-col justify-center items-center w-full"
        onMouseEnter={() => {
          setShow(true);
          if (props.parentStyleDiffHandler) props.parentStyleDiffHandler(false);
        }}
        onMouseLeave={() => {
          setShow(false);
          if (props.parentStyleDiffHandler) props.parentStyleDiffHandler(true);
        }}
      >
        <div className="flex items-center" onClick={toggle}>
          {props.svg}
          <div className="flex items-end">
            <label
              className={`${props.coverPage && 'text-silver'} cursor-pointer hover:text-green-primary`}
            >
              {props.title}
            </label>
            {show ? (
              <SVGCollapse />
            ) : (
              <SVGExpand color={props.coverPage ? COLORS.SILVER : COLORS.DEFAULT} animate={props.animate} />
            )}
          </div>
        </div>
        {show && props.children}
      </div>
    </div>
  );
}
