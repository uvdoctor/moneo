import React, { Fragment, useState } from "react";
import VideoPlayer from "../videoplayer";
import SVGPlay from "../svgplay";
import SVGStop from "../svgstop";
import Link from "next/link";
interface SectionProps {
  title: any;
  left?: any;
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
  color?: string;
  videoSrc?: string;
  link?: string;
}

export default function Section(props: SectionProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <div
      className="m-1 w-full max-w-sm md:max-w-md xl:max-w-lg
      rounded-lg overflow-x-hidden overflow-y-auto 
                        shadow-lg md:shadow-xl"
      style={{ backgroundColor: props.color ? props.color : "transparent" }}
    >
      <div
        className={`w-full ${
          props.insideForm && "bg-gray-700 text-white"
        } flex justify-between relative"
        }`}
      >
        <Link href={props.link ? props.link : ""}>
          <a>
            <div
              className={`p-1 ${
                !props.insideForm && "hover:text-green-primary cursor-pointer"
              }`}
            >
              {props.title}
            </div>
          </a>
        </Link>
        {props.videoSrc && (
          <div
            className="p-1 flex items-center justify-end"
            onClick={() =>
              //@ts-ignore
              setVideoUrl(!videoUrl ? props.videoSrc : "")
            }
          >
            {!videoUrl ? <SVGPlay /> : <SVGStop />}
            <label
              className={`ml-1 cursor-pointer ${
                videoUrl && "text-red-600"
              } hover:text-red-600`}
            >
              Video
            </label>
          </div>
        )}
      </div>
      {videoUrl && <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />}
      {props.toggle && (
        <div className="flex justify-end mt-2 mr-4">{props.toggle}</div>
      )}
      {props.manualMode && props.manualMode > 0 ? (
        props.manualInput
      ) : (
        <Fragment>
          {(props.left || props.right) && (
            <div className="flex flex-col md:flex-row md:flex-wrap justify-around items-center md:items-start w-full">
              {props.left && (
                <div className={`${props.hasResult && "w-full"}`}>
                  {props.left}
                </div>
              )}
              {props.right && <div className="mt-2 md:mt-0">{props.right}</div>}
            </div>
          )}
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
