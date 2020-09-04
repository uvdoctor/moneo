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
  hoverColor?: string;
  defaultSVGColor?: string;
  hoverSVGColor?: string;
}

export default function ExpandCollapse(props: ExpandCollapseProps) {
  const [show, setShow] = useState<boolean>(false);
  const hoverColor = () =>
    props.hoverColor ? props.hoverColor : "text-blue-800";
  const defaultSVGColor = () =>
    props.defaultSVGColor ? props.defaultSVGColor : COLORS.BLUE;
  const hoverSVGColor = () =>
    props.hoverSVGColor ? props.hoverSVGColor : COLORS.DARK_BLUE;

  const toggle = () => setShow(!show);

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
        onClick={toggle}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <div className="flex items-center">
          {props.svg}
          <div className="flex items-end">
            <label
              className={`hover:${hoverColor()} cursor-pointer`}
            >
              {props.title}
            </label>
            {show ? <SVGCollapse color={hoverSVGColor()} /> : <SVGExpand color={defaultSVGColor()} />}
          </div>
        </div>
        {show && props.children}
      </div>
    </div>
  );
}
