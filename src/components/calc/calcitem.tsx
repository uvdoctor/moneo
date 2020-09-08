import Link from "next/link";
import React, { useState } from "react";
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
        insideMenu ? "max-w-xs" : "max-w-sm md:max-w-md xl:max-w-lg shadow-xl"
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
          <div
            className="flex w-full"
            style={{ minHeight: !insideMenu ? "9rem" : "6rem" }}
          >
            <div
              className={`${
                insideMenu ? "w-full" : "w-2/3 md:w-1/2 lg:w-1/3 text-2xl"
              } flex flex-col items-center self-center font-bold hover:text-green-primary`}
            >
              {item.svg}
              <p>{item.title1}</p>
              <p>{item.title2}</p>
            </div>
            <div
              className={`w-full flex justify-center items-center ${
                insideMenu ? "text-base" : "m-2 text-lg"
              } font-normal`}
            >
              {(insideMenu || showDesc) && item.desc}
            </div>
          </div>
        </a>
      </Link>
      {!insideMenu && (
        <div
          className="w-full flex flex-col justify-end items-end"
          style={{ minHeight: "15rem" }}
        >
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
          <div className="w-full flex items-end justify-end">
            <div className="w-1/6"></div>
            <div className="w-full h-full">
              {!videoUrl ? (
                <Link href={item.link}>
                  <a>
                    <img
                      className="object-contain rounded-lg cursor-pointer"
                      src={item.img}
                    />
                  </a>
                </Link>
              ) : (
                <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
