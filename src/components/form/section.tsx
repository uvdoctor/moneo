import React, { Fragment, useState } from "react";
import VideoPlayer from "../videoplayer";
import SVGPlay from "../svgplay";
import SVGStop from "../svgstop";
interface SectionProps {
  title: any;
  titleSVG?: any;
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
  insideMenu?: boolean;
  videoSrc?: string;
}

export default function Section(props: SectionProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <div
      className="m-1 w-full max-w-sm md:max-w-md max-h-md rounded-lg overflow-x-hidden overflow-y-auto 
                        shadow-lg md:shadow-xl"
    >
      {videoUrl && <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />}
      <div
        className={`w-full ${
          props.insideForm && "bg-gray-700 text-white flex justify-between"
        }`}
      >
        <div
          className={`flex items-center p-1 ${
            props.insideMenu && "cursor-pointer"
          }`}
        >
          {props.titleSVG && props.titleSVG}
          <label
            className={`ml-1 ${
              props.insideMenu && "hover:text-green-primary cursor-pointer"
            }`}
          >
            {props.title}
          </label>
        </div>
        {!props.insideMenu && props.videoSrc && (
          <div
            className="p-1"
            onClick={() =>
              //@ts-ignore
              setVideoUrl(!videoUrl ? props.videoSrc : "")
            }
          >
            {!videoUrl ? <SVGPlay /> : <SVGStop />}
          </div>
        )}
      </div>
      {props.toggle && (
        <div className="flex justify-end mt-2 mr-4">{props.toggle}</div>
      )}
      {props.manualMode && props.manualMode > 0 ? (
        props.manualInput
      ) : (
        <Fragment>
          <div className="p-2 flex flex-col md:flex-row md:flex-wrap justify-around items-center md:items-start w-full">
            {props.left && (
              <div className={`${props.hasResult && "w-full"}`}>
                {props.left}
              </div>
            )}
            {props.right && <div className="mt-2 md:mt-0">{props.right}</div>}
          </div>
          {props.bottom && (
            <div className="flex flex-wrap mt-2 items-center justify-center">
              {props.bottomLeft && (
                <label className="mr-4">{props.bottomLeft}</label>
              )}
              <div>{props.bottom}</div>
              {props.bottomRight && (
                <label className="ml-4">{props.bottomRight}</label>
              )}
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
