import React, { ReactNode, useState } from "react";
import SVGExpand from "../svgexpand";
import SVGCollapse from "../svgcollapse";
import SVGInfo from "../svginfo";
import { toast } from "react-toastify";
interface ExpandCollapseProps {
  title: string;
  titleInfo?: string;
  svg?: any;
  insideForm?: boolean;
  children: ReactNode;
}

export default function ExpandCollapse(props: ExpandCollapseProps) {
  const [show, setShow] = useState<boolean>(false)
    const toggle = () => setShow(!show)

  return (
    <div className={`w-full ${props.insideForm && "bg-black text-white py-1"}`}>
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
        onMouseOver={() => {
          if (!show) setShow(true);
        }}
        onMouseOut={() => {
          if (show) setShow(false);
        }}
      >
        <div className="flex items-center">
          {props.svg}
          <div className="flex items-end text-blue-600">
            <label className="text-blue-600 cursor-pointer">
              {props.title}
            </label>
            {show ? <SVGCollapse /> : <SVGExpand />}
          </div>
        </div>
        {show && props.children}
      </div>
    </div>
  );
}
