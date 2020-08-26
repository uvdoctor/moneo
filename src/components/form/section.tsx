import React, { Fragment } from "react";
interface SectionProps {
  title: any;
  left: any;
  right?: any;
  bottomLeft?: any;
  bottomRight?: any;
  bottom?: any;
  footer?: any;
  toggle?: any;
  manualInput?: any;
  manualMode?: number;
  hasResult?: boolean;
  insideForm?: boolean;
}

export default function Section(props: SectionProps) {
  return (
    <div
      className="m-1 w-full max-w-sm md:max-w-md rounded overflow-hidden 
                        shadow-lg md:shadow-xl"
    >
      <div className={`w-full ${props.insideForm && "bg-black text-white"}`}>
        <label className="p-1">{props.title}</label>
      </div>
      {props.toggle && (
        <div className="flex justify-end mt-2 mr-4">{props.toggle}</div>
      )}
      {props.manualMode && props.manualMode > 0 ? (
        props.manualInput
      ) : (
        <Fragment>
          <div className="p-2 flex flex-col md:flex-row md:flex-wrap justify-around items-center md:items-start w-full">
            <div className={`${props.hasResult && "w-full"}`}>{props.left}</div>
            {props.right && <div className="mt-2 md:mt-0">{props.right}</div>}
          </div>
          {props.bottom && (
            <div className="flex flex-wrap mt-2 items-center justify-center">
              <label className="mr-4">{props.bottomLeft}</label>
              {props.bottom}
              <label className="ml-4">{props.bottomRight}</label>
            </div>
          )}
          {props.footer && (
            <div className="mt-2 flex justify-center text-base">
              {props.footer}
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}
