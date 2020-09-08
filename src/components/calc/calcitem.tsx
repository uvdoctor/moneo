import Link from "next/link";
import React, { Fragment, useState } from "react";
import SVGPlay from "../svgplay";
import SVGStop from "../svgstop";
import VideoPlayer from "../videoplayer";

interface CalcItemProps {
  item: any;
  insideMenu?: boolean;
}

export default function CalcItem({ item, insideMenu }: CalcItemProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [showDesc, setShowDesc] = useState<boolean>(false);

  return (
    <div
      className={`w-full flex flex-col text-white cursor-pointer ${
        insideMenu ? "max-w-xs" : "max-w-sm lg:max-w-md xl:max-w-lg shadow-xl"
      } rounded-lg m-1`}
      style={{
        backgroundColor: item.color,
        minHeight: !insideMenu ? "24rem" : "6rem",
      }}
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
        <Link href={item.link}>
          <a>
            <div className="flex w-full"
            style={{ minHeight: !insideMenu ? "9rem" : "6rem" }}>
              <div
                className={`${
                  insideMenu ? "w-full" : "w-1/3 text-xl"
                } flex flex-col items-center self-center font-bold hover:text-green-primary`}
              >
                {item.svg}
                <p>{item.title1}</p>
                <p>{item.title2}</p>
              </div>
              <div className="w-full flex justify-center items-center text-base font-normal">
                {(insideMenu || showDesc) && item.desc}
              </div>
            </div>
          </a>
        </Link>
        {!insideMenu && (
          <Fragment>
            <div
              className="w-full p-1 flex items-end justify-end"
              onClick={() =>
                //@ts-ignore
                setVideoUrl(!videoUrl ? item.video : "")
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
            <div className="w-full flex justify-end items-end">
              <div className="w-1/6"></div>
              <div className="w-full h-full">
                {!videoUrl ? (
                  <img src={item.img} />
                ) : (
                  <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
                )}
              </div>
            </div>
          </Fragment>
        )}
    </div>
  );
}
